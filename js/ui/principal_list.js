define([
    'jquery',
    'jquery.ajax_load',
    'jquery.ui',
    'jquery.msg',
    'jquery.string',
    'blockui',
    'datatables',
    'principal_list_dataTables',
    'bootstrap'
], function() {
    'use strict';

    var principal = function() {
        var $root = this;
        this.cacheLastJson = null;
        $.fn.dataTable.pipeline = function(opts) {
            var conf = $.extend({
                pages: 5, // number of pages to cache
                url: '' // script url
            }, opts);

// Private variables for storing the cache
            var cacheLower = -1;
            var cacheUpper = null;
            var cacheLastRequest = null;
            //var cacheLastJson = null;

            return function(request, drawCallback, settings) {
                var ajax = false;
                var requestStart = request.start;
                var requestLength = request.length;
                var requestEnd = requestStart + requestLength;

                if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
// outside cached data - need to make a request
                    ajax = true;
                }
                else if (JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
                        JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
                        JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
                        ) {
// properties changed (ordering, columns, searching)
                    ajax = true;
                }

// Store the request for checking next time around
                cacheLastRequest = $.extend(true, {}, request);

                if (ajax) {
// Need data from the server
                    if (requestStart < cacheLower) {
                        requestStart = requestStart - (requestLength * (conf.pages - 1));

                        if (requestStart < 0) {
                            requestStart = 0;
                        }
                    }

                    cacheLower = requestStart;
                    cacheUpper = requestStart + (requestLength * conf.pages);

                    request.start = requestStart;
                    request.length = requestLength * conf.pages;

                    settings.jqXHR = $().ajaxLoad({
                        "url": conf.url,
                        "data": request,
                        "success": function(json) {
                            $root.cacheLastJson = $.extend(true, {}, json);

                            if (cacheLower != requestStart) {
                                json.data.splice(0, requestStart - cacheLower);
                            }
                            json.data.splice(requestLength, json.data.length);
                            $.unblockUI();
                            drawCallback(json);
                            $root.updateSize();
                        },
                        "dataType": "json",
                        "cache": false,
                        "message": {
                            message: 'Carregando...',
                            showOverlay: false
                        },
                        "error": function(erro, status) {
                            $.unblockUI();
                            if (erro.readyState == 0 || erro.status == 0)
                                return;
                            if (status == "timeout")
                                $().msgError("<strong>Por Favor, Tente Novamente!</strong>");
                            else
                                $($root.vars.idTooltipMessage).showMessageErr(erro.responseText);
                        }
                    });
                }
                else {
                    var json = $.extend(true, {}, $root.cacheLastJson);
                    json.draw = request.draw; // Update the echo for each response
                    json.data.splice(0, requestStart - cacheLower);
                    json.data.splice(requestLength, json.data.length);

                    drawCallback(json);
                    $root.updateSize();
                    $(".dataTables_scrollBody").animate({
                        scrollTop: 0
                    }, 0);
                }
            };
        };
        this.vars = {
            idBtnConsulta: null,
            idBtnExcluir: null,
            idBtnClearFilters: null,
            idTooltipMessage: null,
            idTabela: null,
            idHeadCheckTable: 'tblHeadCheck',
            idMsgExcluir: "#msgExcluir",
            idTdCheckTable: "tblTdCheck",
            dataTables: {},
            identifier: null,
            constCodigos: "codigos",
            urlBuscarRegistros: null,
            urlExcluirRegistros: null,
            urlEditar: null,
            contentMsgExcluir: "<div class='modal fade' id='msgExcluir' tabindex='-1'" +
                    "role='dialog' aria-labelledby='msgExcluirLabel' aria-hidden='true' style='display:none'>" +
                    "<div class='modal-dialog'>" +
                    "<div class='modal-content'>" +
                    "<div class='modal-header'>" +
                    "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                    "<h4 class='modal-title' id='msgExcluirLabel'> Mensagem de Advertência </h4>" +
                    "</div>" +
                    "<div class='modal-body'>" +
                    "Remover registros selecionados?" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                    "<button type='button' class='btn btn-primary' data-dismiss='modal'> Confirmar </button>" +
                    "<button type='button' class='btn btn-default' data-dismiss='modal'> Cancelar </button>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
        };

        this.updateSize = function() {
            $(this.vars.idTabela).DataTable().columns.adjust();
            $('.dataTables_scrollBody').css('height', (document.documentElement.clientHeight - $(".dataTables_scrollBody").offset().top) + "px");
        };
    };
    principal.prototype = {
        generateCell: function(td, cellData, rowData, row, col) {
            var $root = this;
            var content = $root.vars.urlEditar + '/' + rowData[$root.vars.dataTables.identifier];
            content = $root.formatarColunaClick(content, cellData).children().unwrap();
            $(td).html(content);
        },
        getCheckbox_Checked: function() {
            return $("input:checkbox:checked[name=" + this.vars.idTdCheckTable + "]").parent();
        },
        getTdCheck: function($codigo) {
            var $root = this,
                    td_checkbox = $(document.createElement("td")),
                    codigo = $(document.createElement("input")),
                    checkbox = $(document.createElement("input"));
            codigo.attr('type', 'hidden');
            codigo.val($codigo);
            checkbox.attr('name', $root.vars.idTdCheckTable);
            checkbox.attr('type', 'checkbox');
            checkbox.click(function(event) {
                if (this.checked) {
                    if ($("input[name=" + $root.vars.idTdCheckTable + "]:checked").length ==
                            $("input[name=" + $root.vars.idTdCheckTable + "]").length)
                        $($root.vars.idHeadCheckTable).attr("checked", true);
                }
                else {
                    if ($($root.vars.idHeadCheckTable).attr("checked"))
                        $($root.vars.idHeadCheckTable).attr("checked", false);
                }
            });
            td_checkbox.append(codigo);
            td_checkbox.append(checkbox);
            return td_checkbox;
        },
        formatarColunaClick: function($url, $var) {
            var a = $(document.createElement("a")),
                    td = $(document.createElement("td"));
            a.attr('href', $url);
            a.html($().htmlentities($var));
            a.html($var);
            td.append(a);
            return td;
        },
        acaoLimparFiltros: function() {
            var $root = this;
            $($root.vars.idBtnClearFilters).click(function() {
                var tabela = $($root.vars.idTabela).DataTable();
                tabela.fnFilterClear(tabela.settings()[0]);
            });
        },
        acaoExcluir: function() {
            var $root = this;
            $('body').append(this.vars.contentMsgExcluir);
            $(this.vars.idMsgExcluir).find(".modal-footer").find('button').eq(0).click(function(e) {
                var checkboxes = $root.getCheckbox_Checked();
                var dados = new Object;
                dados[$root.vars.constCodigos] = new Object();
                checkboxes.each(function(index) {
                    dados[$root.vars.constCodigos][index] = $(this).parent().find("input:hidden").val();
                });
                $().ajaxLoad({
                    type: 'post',
                    url: $root.vars.urlExcluirRegistros,
                    timeout: 15000,
                    data: dados,
                    message: "Excluido...",
                    success: function(Dados) {
                        $.each(dados[$root.vars.constCodigos], function(i, codigo) {
                            $.each($root.cacheLastJson.data, function(y, item) {
                                if ($root.cacheLastJson.data.hasOwnProperty(y))
                                    if (item.codigo == codigo) {
                                        $root.cacheLastJson.data.splice(y, 1);
                                        $root.cacheLastJson.recordsFiltered--;
                                        $root.cacheLastJson.recordsTotal--;
                                    }
                            });
                        });
                        $.unblockUI();
                        $($root.vars.idTabela).DataTable().draw(true);

                    },
                    error: function(erro, status) {
                        if (erro.readyState == 0 || erro.status == 0)
                            return;
                        if (status == "timeout")
                            $().msgError("<strong>Por Favor, Tente Novamente!</strong>");
                        else
                            $($root.vars.idTooltipMessage).showMessageErr(erro.responseText);
                    }
                });
            });
            $(this.vars.idMsgExcluir).draggable({
                cursor: 'move'
            });
            $(this.vars.idMsgExcluir).modal({show: false});
            $(this.vars.idMsgExcluir).on('shown', function() {
                $(this).find(".modal-footer").find('button').eq(0).focus();
            });
            $(this.vars.idBtnExcluir).click(function(event) {
                var checkboxes = $root.getCheckbox_Checked();
                if (checkboxes.length == 0)
                    $().msgWarning("<strong>Nenhum registro selecionado!<strong>");
                else {
                    $($root.vars.idMsgExcluir).modal('show');
                }
            });
        },
        acaoConsultar: function() {
            var $root = this;
            $(this.vars.idBtnConsulta).click(function(event) {
                $root.aplicarFiltros().draw();
            });
        },
        onsubmit: function(form) {
            $(form).eq(0).submit(function(event) {
                event.preventDefault();
            });
        },
        aplicarFiltros: function() {
            var tabela = $(this.vars.idTabela).DataTable();
            $(".dataTables_filter_column").each(function() {
                tabela
                        .column($(this).parent().index() + ':visible')
                        .search(this.value);
            });
            $(this.vars.idTabela).DataTable().
                    search($(this.vars.idTabela + '_filter input[type=search]').val());
            return tabela;
        },
        prepararTabela: function() {
            var $root = this,
                    dataTableConfig = {
                        orderCellsTop: true,
                        scrollCollapse: true,
                        scrollY: (document.documentElement.clientHeight - $($root.vars.idTabela).offset().top - 50) + "px",
                        searching: true,
                        processing: false,
                        serverSide: true,
                        pageLength: 25,
                        stripeClasses: ['', ''],
                        language: {
                            lengthMenu: '_MENU_',
                            processing: "Carregando...",
                            info: "<h4><span class='label label-primary'>_START_-_END_ de <b>(_TOTAL_)</b> - _MAX_</span></h4>",
                            infoFiltered: "",
                            emptyTable: "Nenhum registro encontrado",
                            zeroRecords: "Nenhum registro encontrado",
                            infoEmpty: "<h4><span class='label label-default'>0 registros</span></h4>",
                            search: "<div class='input-group'><span class='input-group-addon'><label>Por Todos:</label></span>" +
                                    "_INPUT_" +
                                    "<span class='input-group-btn'></span></div> ",
                            paginate: {
                                next: '<span class="glyphicon glyphicon-chevron-right"></span>',
                                previous: '<span class="glyphicon glyphicon-chevron-left"></span>'
                            }
                        },
                        ajax: $.fn.dataTable.pipeline({
                            url: $root.vars.urlBuscarRegistros
                        }),
                        order: [],
                        columnDefs: [
                            {
                                data: null,
                                title: '<input id="' + $root.vars.idHeadCheckTable + '" type="checkbox"/>',
                                searchable: false,
                                orderable: false,
                                aTargets: [0]
                            }
                        ],
                        initComplete: function(oSettings, json) {
                            $root.updateSize();
                            this.fnSetFilteringPressEnter(oSettings);
                        }
                    };

            $.extend(dataTableConfig, $root.vars.dataTables);

            $($root.vars.idTabela).append('<thead><tr><th></th></tr><tr><th></th></tr></thead>');
            for (var key in dataTableConfig.columns) {
                if (dataTableConfig.columns.hasOwnProperty(key)) {
                    if (!dataTableConfig.columns[key].hasOwnProperty('createdCell'))
                        dataTableConfig.columns[key].createdCell = function(td, cellData, rowData, row, col) {
                            $root.generateCell(td, cellData, rowData, row, col);
                        };

                    var title = dataTableConfig.columns[key].title;
                    var el = '<input class="dataTables_filter_column form-control" type="text" placeholder="Buscar ' + title + '" />';
                    $($root.vars.idTabela + ' thead tr:eq(1)').append('<th>' + el + '</th>');
                    $($root.vars.idTabela + ' thead tr:eq(0)').append('<th></th>');

                }
            }
            /*
             * colocar na primeira posicao o null para primeira coluna
             */
            dataTableConfig.columns.unshift({"data": null, createdCell: function(td, cellData, rowData, row, col) {
                    var content = $root.getTdCheck(rowData[$root.vars.dataTables.identifier]).children().unwrap();
                    $(td).html(content);
                }});
            $($root.vars.idTabela).DataTable(dataTableConfig);
            $($root.vars.idBtnConsulta).appendTo($root.vars.idTabela + '_filter .input-group-btn');
            $($root.vars.idBtnConsulta).show();
            $($root.vars.idTabela + '_filter > label').addClass('col-xs-12');
            $(".dataTables_filter_column").on('keypress change', function(e) {
                if (e.which === 13) {
                    $root.aplicarFiltros().draw();
                }
            });
        },
        initialize: function(opcoes) {
            var $root = this;
            $.extend(this.vars, opcoes);
            this.prepararTabela();
            if (this.vars.idHeadCheckTable != null)
                $('#' + this.vars.idHeadCheckTable).click(function(e) {
                    if (this.checked)
                        $("input[name=" + $root.vars.idTdCheckTable + ']:not(:checked)').each(function() {
                            this.checked = true;
                        });
                    else
                        $("input[name=" + $root.vars.idTdCheckTable + "]").each(function() {
                            this.checked = false;
                        });
                });

            this.acaoConsultar();
            this.acaoExcluir();
            this.acaoLimparFiltros();
            $(window).resize(function() {
                clearTimeout(window.refresh_size);
                window.refresh_size = setTimeout(function() {
                    $root.updateSize();
                }, 100);
            });
            $('body').css('overflow-y', 'hidden');
            $('button[class="close"][aria-hidden="true"][data-dismiss="alert"]').on('click', function() {
                $(window).resize();
            });
            this.onsubmit('form');
        }
    };
    return principal;
});