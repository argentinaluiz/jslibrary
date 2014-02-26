define([
    'jquery',
    'jquery.ajax_load',
    'jquery.ui',
    'jquery.msg',
    'blockui',
    'datatables',
    'principal_list_dataTables',
    'bootstrap'
], function() {
    'use strict';

    var principal = function Principal_List() {
        var $root = this;
        this.oCache = {
            iCacheLower: -1
        };

        function fnSetKey(aoData, sKey, mValue)
        {
            for (var i = 0, iLen = aoData.length; i < iLen; i++)
                if (aoData[i].name == sKey)
                    aoData[i].value = mValue;
        }

        function fnGetKey(aoData, sKey)
        {
            for (var i = 0, iLen = aoData.length; i < iLen; i++)
                if (aoData[i].name == sKey)
                    return aoData[i].value;
            return null;
        }

        this.fnDataTablesPipeline = function(sUrl, aoData, fnCallback, oSettings) {
            var iPipe = 5; /* Ajust the pipe size */

            var bNeedServer = false;
            var sEcho = fnGetKey(aoData, "sEcho");
            var iRequestStart = fnGetKey(aoData, "iDisplayStart");
            var iRequestLength = fnGetKey(aoData, "iDisplayLength");
            var iRequestEnd = iRequestStart + iRequestLength;
            $root.oCache.iDisplayStart = iRequestStart;

            /* outside pipeline? */
            if ($root.oCache.iCacheLower < 0 || iRequestStart < $root.oCache.iCacheLower || iRequestEnd > $root.oCache.iCacheUpper)
                bNeedServer = true;

            /* sorting etc changed? */
            if ($root.oCache.lastRequest && !bNeedServer)
                for (var i = 0, iLen = aoData.length; i < iLen; i++)
                    if (aoData[i].name != "iDisplayStart" && aoData[i].name != "iDisplayLength" && aoData[i].name != "sEcho")
                        if (aoData[i].value != $root.oCache.lastRequest[i].value)
                        {
                            bNeedServer = true;
                            break;
                        }

            /* Store the request for checking next time around */
            $root.oCache.lastRequest = aoData.slice();

            if (bNeedServer)
            {
                if (iRequestStart < $root.oCache.iCacheLower)
                {
                    iRequestStart = iRequestStart - (iRequestLength * (iPipe - 1));
                    if (iRequestStart < 0)
                        iRequestStart = 0;
                }

                $root.oCache.iCacheLower = iRequestStart;
                $root.oCache.iCacheUpper = iRequestStart + (iRequestLength * iPipe);
                $root.oCache.iDisplayLength = fnGetKey(aoData, "iDisplayLength");
                fnSetKey(aoData, "iDisplayStart", iRequestStart);
                fnSetKey(aoData, "iDisplayLength", iRequestLength * iPipe);

                oSettings.jqXHR = $().ajaxLoad({
                    "url": sUrl,
                    "data": aoData,
                    "success": function(json) {
                        $root.oCache.lastJson = $.extend(true, {}, json);

                        if ($root.oCache.iCacheLower != $root.oCache.iDisplayStart)
                        {
                            json.rows.splice(0, $root.oCache.iDisplayStart - $root.oCache.iCacheLower);
                        }
                        json.rows.splice($root.oCache.iDisplayLength, json.rows.length);
                        $.unblockUI();
                        fnCallback(json);
                        $($root.vars.idTabela).dataTable().fnAdjustColumnSizing(false);
                        $('.dataTables_scrollBody').css('height', (document.documentElement.clientHeight - $($root.vars.idTabela + "_wrapper").offset().top - 43 -
                                $($root.vars.idTabela + "_wrapper .row").height()) + "px");
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
            else
            {
                var json = $.extend(true, {}, $root.oCache.lastJson);
                json.sEcho = sEcho; /* Update the echo for each response */
                json.rows.splice(0, iRequestStart - $root.oCache.iCacheLower);
                json.rows.splice(iRequestLength, json.rows.length);
                fnCallback(json);
                $($root.vars.idTabela).dataTable().fnAdjustColumnSizing(false);
                $('.dataTables_scrollBody').css('height', (document.documentElement.clientHeight - $($root.vars.idTabela + "_wrapper").offset().top - 43 -
                        $($root.vars.idTabela + "_wrapper .row").height()) + "px");
                $(".dataTables_scrollBody").animate({
                    scrollTop: 0
                }, 0);
            }
            return;
        };
        this.vars = {
            idBtnConsulta: null,
            idBtnExcluir: null,
            idTooltipMessage: null,
            idTabela: null,
            idOpcoesConsulta: null,
            idHeadCheckTable: null,
            "aoColumns": [],
            idMsgExcluir: "#msgExcluir",
            idTdCheckTable: "tblTdCheck",
            constCodigos: "codigos",
            urlBuscarRegistros: null,
            urlExcluirRegistros: null,
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

        this.alterarOpcoesConsulta = null;
        this.getOpcoesConsulta = null;
        this.onsubmit = function(form) {
            $(form).eq(0).submit(function(event) {
                $($root.vars.idTabela).dataTable().fnDraw();
                event.preventDefault();
            });
        };

    };
    principal.prototype = {
        popularTabela: null,
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
                            $.each($root.oCache.lastJson.rows, function(y, item) {
                                if ($root.oCache.lastJson.rows.hasOwnProperty(y))
                                    if (item.codigo == codigo) {
                                        $root.oCache.lastJson.rows.splice(y, 1);
                                        $root.oCache.lastJson.iTotalDisplayRecords--;
                                        $root.oCache.lastJson.iTotalRecords--;
                                    }
                            });
                        });
                        $.unblockUI();
                        $($root.vars.idTabela).dataTable().fnDraw(true);

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
                $($root.vars.idTabela).dataTable().fnDraw();
            });
        },
        prepararTabela: function() {
            var $root = this;

            $($root.vars.idTabela).dataTable({
                "sPaginationType": "bootstrap",
                "bScrollCollapse": true,
                "sScrollY": (document.documentElement.clientHeight - $("#tabela").offset().top - 50) + "px",
                "bFilter": false,
                "bProcessing": false,
                "bServerSide": true,
                "sAjaxSource": $root.vars.urlBuscarRegistros,
                "sAjaxDataProp": "rows",
                "iDisplayLength": 25,
                "asStripeClasses": ['', ''],
                "oLanguage": {
                    "sLengthMenu": '<select class="pagesize form-control">' +
                            '<option value="10">10</option>' +
                            '<option value="25">25</option>' +
                            '<option value="35">35</option>' +
                            '<option value="50">50</option>' +
                            '</select>',
                    "sProcessing": "Carregando...",
                    "sInfo": "<h4><span class='label label-primary'>_START_-_END_ de <b>(_TOTAL_)</b></span></h4>",
                    "sEmptyTable": "Nenhum registro encontrado",
                    "sInfoEmpty": "<h4><span class='label label-default'>0 registros</span></h4>",
                    "oPaginate": {
                        "sNext": '<span class="glyphicon glyphicon-chevron-right"></span>',
                        "sPrevious": '<span class="glyphicon glyphicon-chevron-left"></span>'
                    }
                },
                "aoColumnDefs": [
                    {'bSortable': false, 'aTargets': [0]}
                ],
                "aoColumns": $root.vars.aoColumns,
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                    nRow = $root.popularTabela(aData, nRow);
                    return nRow;
                },
                "fnServerParams": function(aoData) {
                    var object = $root.getOpcoesConsulta();
                    for (var i = 0; i < object.length; i++) {
                        aoData.push(object[i]);
                    }
                },
                "fnInitComplete": function(oSettings, json) {
                    $($root.vars.idTabela).dataTable().fnAdjustColumnSizing(false);
                    $('.dataTables_scrollBody').css('height', (document.documentElement.clientHeight - $($root.vars.idTabela + "_wrapper").offset().top - 43 -
                            $($root.vars.idTabela + "_wrapper .row").height()) + "px");
                },
                "fnServerData": $root.fnDataTablesPipeline
            });
            $('body').css('overflow-y', 'hidden');
            $('.panel-search').html($('[id="panel-search.html"]').html());
            $('[id="panel-search.html"]').remove();
            var update_size = function() {
                $($root.vars.idTabela).dataTable().fnAdjustColumnSizing(false);
                $('.dataTables_scrollBody').css('height', (document.documentElement.clientHeight - $($root.vars.idTabela + "_wrapper").offset().top - 43 -
                        $($root.vars.idTabela + "_wrapper .row").height()) + "px");
            };

            $(window).resize(function() {
                clearTimeout(window.refresh_size);
                window.refresh_size = setTimeout(function() {
                    update_size();
                }, 100);
            });
            $('button[class="close"][aria-hidden="true"][data-dismiss="alert"]').on('click', function() {
                $(window).resize();
            });
        },
        initialize: function(opcoes) {
            var $root = this;
            $.extend(this.vars, opcoes);
            this.prepararTabela();
            if (this.vars.idHeadCheckTable != null)
                $(this.vars.idHeadCheckTable).click(function(e) {
                    if (this.checked)
                        $("input[name=" + $root.vars.idTdCheckTable + ']:not(:checked)').each(function() {
                            this.checked = true;
                        });
                    else
                        $("input[name=" + $root.vars.idTdCheckTable + "]").each(function() {
                            this.checked = false;
                        });
                });
            if (this.alterarOpcoesConsulta != null)
                $(this.vars.idOpcoesConsulta).change(this.alterarOpcoesConsulta);

            this.acaoConsultar();
            this.acaoExcluir();
            this.onsubmit('form');
        }
    };
    return principal;
});