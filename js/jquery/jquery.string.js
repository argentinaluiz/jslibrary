define(['jquery'], function($) {
    'use strict';
    //'The {0} is dead. Don\'t code {0}. Code {1} that is open source!'.format('ASP', 'PHP');
    String.prototype.format = function() {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };
    $.fn.escapeRegExp = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    $.fn.normalizeText = function(term) {
        var ret = "";
        var accentMap = {
            "á": "a",
            "à": "a",
            "Á": "A",
            "À": "A",
            "é": "e",
            "É": "E",
            "í": "i",
            "Í": "I",
            "ó": "o",
            "Ó": "O",
            "ú": "u",
            "Ú": "U",
            "ç": "c",
            "Ç": "c"
        };
        for (var i = 0; i < term.length; i++) {
            ret += accentMap[ term.charAt(i) ] || term.charAt(i);
        }
        return ret;
    };

    $.fn.htmlentities = function(text) {
        return $('<div/>').text(text).html();
    };
    $.fn.htmlentities_decode = function(text) {
        return $('<div/>').html(text).text();
    };
    $.fn._replaceAll = function(string, token, newtoken) {
        while (string.indexOf(token) !== -1) {
            string = string.replace(token, newtoken);
        }
        return string;
    };
    $.fn.ucwords = function(str) {
        return (str).replace(/^([a-z])|\s+([a-z])/g, function($1) {
            return $1.toUpperCase();
        });
    };
    $.fn.formatCgc = function(value) {
        var result;
        switch (value.length) {
            case 11:
                result = $().formatCpf(value);
                break;
            case 14:
                result = $().formatCnpj(value);
                break;
            default:
                result = $().formatCpf(value);
        }
        return result;
    };
    $.fn.formatCnpj = function(value) {
        if (value !== null && value.length === 14) {
            return value.substring(0, 2) + '.' +
                    value.substring(2, 5) + '.' +
                    value.substring(5, 8) + '/' +
                    value.substring(8, 12) + '-' +
                    value.substring(12, 14);
        }
        else {
            return value;
        }
    };
    $.fn.formatCpf = function(value) {
        if (value !== null && value.length === 11) {
            return value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9, 11);
        }
        else {
            return value;
        }
    };
    $.fn.formatTelefone = function(value)
    {
        if (value !== null && value.length === 10) {
            return '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6, 10);
        }
        else {
            return value;
        }
    };
    $.fn.formatCEP = function(value)
    {
        if (value !== null && value.length === 8) {
            return value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        else {
            return value;
        }
    };
    $.fn.formatCNPJ = function(value)
    {
        if (value !== null && value.length === 14)
            return value.substring(0, 2) + '.' + value.substring(2, 5) + '.' +
                    value.substring(5, 8) + '/' + value.substring(8, 12) + "-" +
                    value.substring(12, 14);
        else
            return value;
    };
    $.fn.formatInsEst = function(value)
    {
        if (value !== null && value.length === 12)
            return value.substring(0, 3) + '.' + value.substring(3, 6) + '.' +
                    value.substring(6, 9) + '.' + value.substring(9, 12);
        else
            return value;
    };
    $.fn.pegarNumeros = function(value)
    {
        var numeros = "";
        numeros = value.match(/\d/g);
        if (numeros !== null)
            numeros = numeros.join("");
        else
            numeros = "";
        return numeros;
    };
});