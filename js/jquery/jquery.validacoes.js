define(['jquery', 'jquery.validation', 'jquery.string'], function($) {
    'use strict';
    $.validator.addMethod("validaTelefone", function(value, element) {
        value = $().pegarNumeros(value);
        return value.match(/^[0-9]{10}$/);
    });
    $.validator.addMethod("valida_telefones", function(value, element, options) {
        var validator = this,
                selector = options[1],
                fields = $(selector, element.form),
                validOrNot = fields.filter(function() {
                    return $().pegarNumeros(validator.elementValue(this)).length >= 10;
                }).length >= options[0];
        if (validOrNot) {
            fields.each(function() {
                var el = $(this);
                if (el.attr("id") != $(element).attr("id")) {
                    el.removeClass("ui-state-highlight");
                    el.parent().find("label[for=" + el.attr("id") + "][class='error']").parent().remove();
                }
            });
        }
        else {
            fields.each(function() {
                var el = $(this);
                if (el.attr("id") != $(element).attr("id"))
                    if (el.attr("class").indexOf("ui-state-highlight") == -1)
                    {
                        el.addClass("ui-state-highlight");
                        var object = new Object();
                        object[el.attr("id")] = "Preencha pelo Menos um Telefone"
                        $(element.form).validate().showErrors(object);
                    }
            })
        }
        return validOrNot;
    }, "Preencha pelo Menos um Telefone");

    $.validator.addMethod("validaCGC", function(value, element) {
        if (value.indexOf('_') == -1 && value.length == 14)
            validaCPF(value);
        else
        if (value.indexOf('_') == -1 && value.length == 18)
            validaCNPJ(value);
        return true;
    }, "Informe um CGC valido.");

    $.validator.addMethod("validaCpf", function(value, element) {
        return validaCPF(value);
    }, "Informe um CPF valido.");

    $.validator.addMethod("validaCnpj", function(value, element) {
        return validaCNPJ(value);
    }, "Informe um CNPJ valido.");

    function validaCPF(value) {
        value = value.replace('.', '');
        value = value.replace('.', '');
        value = $()._replaceAll(value, '_', '');
        var cpf = value.replace('-', ''),
                expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/,
                a = [],
                b = 0,
                c = 11,
                i,
                x,
                y;
        if (cpf == "00000000000" || cpf == "") {
            return true;
        }
        if (cpf.length < 11) {
            return false;
        }
        for (i = 0; i < 11; i++) {
            a[i] = cpf.charAt(i);
            if (i < 9) {
                b += (a[i] * --c);
            }
        }
        if ((x = b % 11) < 2) {
            a[9] = 0;
        }
        else {
            a[9] = 11 - x;
        }
        b = 0;
        c = 11;
        for (y = 0; y < 10; y++) {
            b += (a[y] * c--);
        }
        if ((x = b % 11) < 2) {
            a[10] = 0;
        }
        else {
            a[10] = 11 - x;
        }
        if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) {
            return false;
        }
        return true;
    }

    function validaCNPJ(cnpj) {
        cnpj = $.trim(cnpj);// retira espaços em branco
        // DEIXA APENAS OS NÚMEROS
        cnpj = cnpj.replace('/', '');
        cnpj = cnpj.replace('-', '');
        cnpj = $()._replaceAll(cnpj, '_', '');
        cnpj = $()._replaceAll(cnpj, '.', '');
        if (cnpj == "00000000000000" || cnpj == "")
            return true;
        var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
        digitos_iguais = 1;

        if (cnpj.length < 14) {
            return false;
        }
        for (i = 0; i < cnpj.length - 1; i++) {
            if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        }

        if (!digitos_iguais) {
            tamanho = cnpj.length - 2
            numeros = cnpj.substring(0, tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0)) {
                return false;
            }
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1)) {
                return false;
            }
            return true;
        } else
            return false;
    }

    $.validator.addMethod("valida_data", function(value, element, options) {
        if (value.indexOf('_') == -1 && value != "")
        {
            var currVal = value;
            if (currVal == '')
                return false;

            //Declare Regex  
            var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
            var dtArray = currVal.match(rxDatePattern); // is format OK?

            if (dtArray == null)
                return false;

            //Checks for mm/dd/yyyy format.
            var dtMonth = dtArray[3];
            var dtDay = dtArray[1];
            var dtYear = dtArray[5];

            if (dtMonth < 1 || dtMonth > 12)
                return false;
            else if (dtDay < 1 || dtDay > 31)
                return false;
            else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
                return false;
            else if (dtMonth == 2)
            {
                var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
                if (dtDay > 29 || (dtDay == 29 && !isleap))
                    return false;
            }
            return true;
        }
        return true;
    }, "Informe uma Data Válida");

    $.validator.addMethod('filesize', function(value, element, param) {
        // param = size (en bytes) 
        // element = element to validate (<input>)
        // value = value of the element (file name)
        return this.optional(element) || (element.files[0].size <= param);
    });

    /*$.validator.methods.number = function(value, element) {
     return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.,]\d{3})+)(?:[\.,]\d+)?$/.test(value);
     };*/

    $.validator.methods.min = function(value, element, param) {
        if (value.indexOf('.') !== -1)
            while (value.indexOf('.') !== - 1)
                value = value.substring(0, value.indexOf('.')) + value.substring(value.indexOf('.') + 1, value.length);
        if (value.indexOf(',') !== -1)
            value = value.substring(0, value.indexOf(',')) + '.' + value.substring(value.indexOf(',') + 1, value.length);
        return value > param;
    };

    $.validator.methods.number = function(value, element) {
        return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.]\d{3})+)(?:[,]\d+)?$/.test(value);
    };

    $.validator.addMethod('int', function(value, element, param) {
        return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.]\d{3})+)?$/.test(value);
    });
});

