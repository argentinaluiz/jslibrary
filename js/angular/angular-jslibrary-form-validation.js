define([
    'jquery',
    'jquery.ui',
    'jquery.validation',
    'jquery-scrollto',
    'bootstrap',
    'angular',
    'angular-bootstrap'
], function() {
    'use strict';
    $(function() {
        var jslibrary = angular.module('jslibrary.form', ['ui.bootstrap']),
                jsValidation = function($rootScope, $modal) {
                    var $this = this;
                    this.modalInstance = null;
                    this.options = {
                        selectorCodigo: "[data-selector-codigo]",
                        modal: {
                            backdrop: true,
                            keyboard: true
                        },
                        validation: {
                            rules: {},
                            messages: {},
                            highlight: function(element) {
                                $(element).closest('.form-group').addClass('has-error');
                            },
                            success: function(element) {
                                $('input[name=\'' + element.attr('for') + "\']").
                                        addClass('valid').closest('.form-group').removeClass('has-error');
                            },
                            errorPlacement: function(error, element) {
                                var ul = element.closest('.form-group').find('.help-block');
                                if (ul.length)
                                    ul.html("<li>" + error.html() + "</li>");
                                else
                                    element.closest('.form-group').append("<ul class='help-block'><li>" + error.html() + "</li></ul>");
                            },
                            invalidHandler: function(form, validator) {
                                var num_errors = validator.numberOfInvalids();
                                if (num_errors > 0) {
                                    var els = validator.invalidElements();
                                    var el = $(els[0]);
                                    var label = $('label[for=\'' + el.attr('name') + '\']');
                                    if (label.length > 0) {
                                        $('label[for=\'' + el.attr('name') + '\']').ScrollTo({
                                            offsetTop: 49
                                        });
                                    }
                                    else {
                                        $(els[0]).ScrollTo({
                                            offsetTop: 59
                                        });
                                    }
                                }
                            },
                            submitHandler: function(form) {
                                if ($($this.options.selectorCodigo).val() !== "") {
                                    $rootScope.$apply(function() {
                                        $this.modalInstance = $modal.open($this.options.modal);
                                        $this.modalInstance.result.then(function(result) {
                                            if (result)
                                                form.submit();
                                        });
                                        $this.modalInstance.opened.then(function(e) {
                                            if (e) {
                                                setTimeout(function() {
                                                    $('.modal').find('.modal-footer').find('button').eq(0).focus();
                                                    $('.modal').draggable({cursor: 'move'
                                                    });
                                                }, 100);
                                            }

                                        });
                                    });
                                } else
                                    form.submit();
                            }
                        }
                    };
                    this.validate = function(selectorForm) {
                        $('input[required=required]').each(function() {
                            $("label[for='" + $(this).attr('id') + "']").prepend('* ');
                        });
                        return $(selectorForm).validate(this.options.validation);
                    };
                };
        jslibrary.service('$jsValidation', ['$rootScope', '$modal', jsValidation]);
    });
});