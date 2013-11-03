define(['jquery','libs/jquery.blockUI'], function($) {
    'use strict';
    var carregandodados = {
        overlayCSS: {
            backgroundColor: '#fff',
            cursor: 'default',
            opacity: 0
        },
        fadeIn: 10,
        fadeOut: 20,
        centerY: 0,
        css: {
            top: '50px',
            left: ($(window).width() - 105) / 2 + $(window).scrollLeft() + "px",
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
        message: '<div class="btn btn-warning"><strong>Carregando...</strong></div>'
    };
    $.fn.ajaxLoad = function(object) {
        $.unblockUI();
        if (object.hasOwnProperty('message'))
            $().loading(object.message);
        else
            $().loading();
        $.ajax(object);
    };

    $.fn.loading = function(message) {
        if (message == undefined)
            carregandodados.message = '<div class="btn btn-warning"><strong>Carregando...</strong></div>';
        else
            carregandodados.message = '<div class="btn btn-warning"><strong>' + message + '</strong></div>';
        $.blockUI(carregandodados);
    };
});
