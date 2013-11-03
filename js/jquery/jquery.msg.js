define(['jquery', 'libs/jquery.blockUI'], function($) {
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
            width: 'auto',
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

    icon_adv = document.createElement("i");
    icon_adv.setAttribute('class', "icon-warning-sign");

    icon_inf = document.createElement("i");
    icon_inf.setAttribute('class', "icon-info-sign");

    icon_err = document.createElement("i");
    icon_err.setAttribute('class', "icon-warning-sign");

    $.fn.msgSuccess = function(msg) {
        $.unblockUI();
        blockUIMessage.message = "<div class='alert alert-success'>" +
                icon_inf.outerHTML +
                msg +
                "</div>";
        $.blockUI(blockUIMessage);
    };
    $.fn.msgInfo = function(msg) {
        $.unblockUI();
        blockUIMessage.message = "<div class='alert alert-info'>" +
                icon_inf.outerHTML +
                msg +
                "</div>";
        $.blockUI(blockUIMessage);
    };
    $.fn.msgWarning = function(msg) {
        $.unblockUI();
        blockUIMessage.message = "<div class='alert alert-warning'>" +
                icon_adv.outerHTML +
                msg +
                "</div>";
        $.blockUI(blockUIMessage);
    };
    $.fn.msgError = function(msg) {
        $.unblockUI();
        blockUIMessage.message = "<div class='alert alert-error'>" +
                icon_err.outerHTML +
                msg +
                "</div>";
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