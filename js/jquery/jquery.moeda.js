(function($) {
    'use strict';
    /**
     * @param {event} e
     */
    $.fn.somenteNumero = function(e) {
        var tecla = (window.event) ? event.keyCode : e.which;
        if ((tecla > 47 && tecla < 58))
            return true;
        else {
            if (tecla === 8 || tecla === 0)
                return true;
            else
                e.preventDefault();
        }
    };
    /**
     * @param {string} num
     */
    $.fn.getMoedaAmericana = function(num)
    {
        if (num.indexOf('.') !== -1)
            while (num.indexOf('.') !== - 1)
                num = num.substring(0, num.indexOf('.')) + num.substring(num.indexOf('.') + 1, num.length);
        if (num.indexOf(',') !== -1)
            num = num.substring(0, num.indexOf(',')) + '.' + num.substring(num.indexOf(',') + 1, num.length);
        return num;
    };
    $.fn.maskReal = function() {
        $(this).maskMoney({symbol: '',
            thousands: '.',
            decimal: ',',
            allowZero: true
        });
        $(this).maskMoney('mask');
    };
    $.fn.maskInteiro = function() {
        $(this).maskMoney({symbol: '',
            thousands: '.',
            decimal: ',',
            precision: 0,
            allowZero: true
        });
        $(this).maskMoney('mask');
    };
})(jQuery);