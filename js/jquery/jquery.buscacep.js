define(['jquery'], function($) {
    'use strict';
    /**
     * @param {string} cep
     * @param {string} endereco
     * @param {string} bairro
     * @param {string} cidade
     * @param {string} estado
     */
    $.fn.buscaCep = function(cep, endereco, bairro, cidade, estado) {
        $(cep).blur(function() {
            var $endereco = $(endereco).val(),
                    $bairro = $(bairro).val(),
                    $cidade = $(cidade).val(),
                    $estado = $(estado).val(),
                    q = $(cep).val();
            $(endereco).val("Carregando...");
            $(bairro).val("Carregando...");
            $(cidade).val("Carregando...");
            $(estado).val("Carregando...");

            $.getScript("http://cep.republicavirtual.com.br/web_cep.php?cep=" + q + "&formato=javascript",
                    function(resultadoCEP) {
                        try
                        {
                            var newEndereco = decodeURI(resultadoCEP.tipo_logradouro + " " + resultadoCEP.logradouro),
                                    newBairro = decodeURI(resultadoCEP.bairro),
                                    newCidade = decodeURI(resultadoCEP.cidade),
                                    newEstado = decodeURI(resultadoCEP.uf);
                            $(endereco).val(newEndereco == " " ? "" : newEndereco).closest('form').validate().element(endereco);
                            $(bairro).val(newBairro).closest('form').validate().element(bairro);
                            $(cidade).val(newCidade).closest('form').validate().element(cidade);
                            $(estado).val(newEstado).closest('form').validate().element(estado);
                        } catch (e) {
                            $(endereco).val($endereco);
                            $(bairro).val($bairro);
                            $(cidade).val($cidade);
                            $(estado).val($estado);
                        }
                    });
        });
    };
});