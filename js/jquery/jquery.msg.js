define(['jquery', 'blockui'], function($) {
    'use strict';
    var blockUIMessage = {
        fadeIn: 200,
        timeout: 4500,
        fadeOut: 200,
        centerY: 0,
        centerX: true,
        showOverlay: false,
        css: {
            top: '50px',
            right: '',
            left: function() {
                return($(window).width() - 200) / 2 + $(window).scrollLeft() + "px";
            },
            width: '200px',
            "font-size": '14px',
            border: '',
            background: '',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: 0.95,
            color: '#fff',
            cursor: ''
        },
        message: ''
    },
    icon_adv, icon_inf, icon_err;

    icon_adv = document.createElement("span");
    icon_adv.setAttribute('class', "glyphicon glyphicon-exclamation-sign");

    icon_inf = document.createElement("span");
    icon_inf.setAttribute('class', "glyphicon glyphicon-exclamation-sign");

    icon_err = document.createElement("span");
    icon_err.setAttribute('class', "glyphicon glyphicon-exclamation-sign");

    $.fn.msgSuccess = function(msg) {
        $.unblockUI();
        blockUIMessage.message = "<h4><div class='alert alert-success'>" +
                icon_inf.outerHTML + "&nbsp;" +
                msg +
                "</div></h4>";
        $.blockUI(blockUIMessage);
    };
    $.fn.msgInfo = function(msg) {
        $.unblockUI();
        blockUIMessage.message = "<h4><div class='alert alert-info'>" +
                icon_inf.outerHTML + "&nbsp;" +
                msg +
                "</div></h4>";
        $.blockUI(blockUIMessage);
    };
    $.fn.msgWarning = function(msg) {
        $.unblockUI();
        blockUIMessage.message = "<h4><div class='label label-warning'>" +
                icon_adv.outerHTML + "&nbsp;" +
                msg +
                "</div></h4>";
        $.blockUI(blockUIMessage);
    };
    $.fn.msgError = function(msg) {
        $.unblockUI();
        blockUIMessage.message = "<h4><div class='label label-danger'>" +
                icon_err.outerHTML + "&nbsp;" +
                msg +
                "</div></h4>";
        $.blockUI(blockUIMessage);
    };
    $.fn.showMessageErr = function(mensagem) {
        $(this).html(mensagem);
        $().msgError("<strong>Erro no sistema! Verifique no topo da página</strong>");
    };
    $.fn.msgTooltipTb = function(mensagem, type) {
        var div;
        if (Object.prototype.toString.call(mensagem) === '[object Array]')
            mensagem = generateListaFromArray(mensagem);
        switch (type) {
            case 'information':
                div = "<div class='alert alert-info' style='margin-top:10px'>" +
                        "<button type='button' class='close' data-dismiss='alert'>&times;</button>" +
                        mensagem +
                        "</div>";
                break;
            case 'success':
                div = "<div class='alert alert-success' style='margin-top:10px'>" +
                        "<button type='button' class='close' data-dismiss='alert'>&times;</button>" +
                        mensagem +
                        "</div>";
                break;
            case 'error':
                div = "<div class='alert alert-error' style='margin-top:10px'>" +
                        "<button type='button' class='close' data-dismiss='alert'>&times;</button>" +
                        mensagem +
                        "</div>";
                break;
            case 'warning':
                div = "<div class='alert alert-block' style='margin-top:10px'>" +
                        "<button type='button' class='close' data-dismiss='alert'>&times;</button>" +
                        mensagem +
                        "</div>";
                break;
        }
        $(this).html(div);
    };
    function generateListaFromArray(array) {
        var ul = $(document.createElement('ul'));
        $.each(array, function(i)
        {
            var li = $(document.createElement('li')).
                    append(array[i]).
                    appendTo(ul);
        });
        return ul[0].outerHTML;
    }
});