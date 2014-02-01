define([
    'jquery',
    'jquery.ajax_load',
    'jquery.ui',
    'jquery.msg',
    'blockui',
    'datatables',
    'principal_list_dataTables',
    'bootstrap'
], function($) {
    'use strict';
    var principal = function Principal_List() {
        this.vars = {
            idBtnConsulta: null,
            idBtnExcluir: null,
            idTooltipMessage: null,
            idTabela: null,
            idOpcoesConsulta: null,
            idLabelBusca: null,
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
        this.mostrarLabelBusca = null;
        this.getOpcoesConsulta = null;
        this.onsubmit = function(form) {
            var $root = this;
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
                //"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
                //"sDom": "<'row-fluid'<'span6'><'span6'f>r>t<'row-fluid'<'span6'il><'span6'p>>",
                //"sDom": "<'row'r>t<'row'<'col-md-6'il><'col-md-6'p>>",
                "sPaginationType": "bootstrap",
                //"sStripeOdd": "alert alert-info",
                //"sStripeEven": "even",
                "bScrollCollapse": true,
                "bFilter": false,
                "bProcessing": false,
                "bServerSide": true,
                "sAjaxSource": $root.vars.urlBuscarRegistros,
                "sAjaxDataProp": "rows",
                "iDisplayLength": 25,
                "oLanguage": {
                    "sLengthMenu": '<select class="pagesize">' +
                            '<option value="10">10</option>' +
                            '<option value="25">25</option>' +
                            '<option value="35">35</option>' +
                            '<option value="50">50</option>' +
                            '</select>',
                    "sProcessing": "Carregando...",
                    "sInfo": "_START_ - _END_ de <b>(_TOTAL_)</b> registros",
                    "sEmptyTable": "Nenhum registro encontrado",
                    "sInfoEmpty": "0 registros",
                    "oPaginate": {
                        "sFirst": "<<",
                        "sLast": ">>",
                        "sNext": ">",
                        "sPrevious": "<"
                    }
                },
                "aoColumnDefs": [
                    {'bSortable': false, 'aTargets': [0]}
                ],
                "aoColumns": $root.vars.aoColumns,
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                    $($root.vars.idLabelBusca).html($root.mostrarLabelBusca());
                    nRow = $root.popularTabela(aData, nRow);
                    return nRow;
                },
                "fnServerParams": function(aoData) {
                    var object = $root.getOpcoesConsulta();
                    for (var i = 0; i < object.length; i++) {
                        aoData.push(object[i]);
                    }
                },
                "fnServerData": function(sUrl, aoData, fnCallback, oSettings) {

                    oSettings.jqXHR = $().ajaxLoad({
                        "url": sUrl,
                        "data": aoData,
                        "success": function(json) {
                            $.unblockUI();
                            fnCallback(json);
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
                            fnCallback({"iTotalDisplayRecords": 0,
                                'iTotalRecords': 0,
                                'rows': []});
                        }
                    });
                }
            });
            var update_size = function() {
                $($root.vars.idTabela).css({width: $($root.vars.idTabela).parent().width()});
                $($root.vars.idTabela).dataTable().fnAdjustColumnSizing(false);
            };

            $(window).resize(function() {
                clearTimeout(window.refresh_size);
                window.refresh_size = setTimeout(function() {
                    update_size();
                }, 100);
            });
        },
        initialize: function(opcoes) {
            var $root = this;
            $.extend(this.vars, opcoes);
            if (this.alterarOpcoesConsulta != null)
                $(this.vars.idOpcoesConsulta).change(this.alterarOpcoesConsulta);
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

            this.acaoConsultar();
            this.acaoExcluir();
            this.onsubmit('form');
        }
    };
    return principal;
});