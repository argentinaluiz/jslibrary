define([
    'jquery',
    'jquery.ui',
    'jquery.validation',
    'jquery-scrollto',
    'jquery.ajax_load',
    'jquery.msg',
    'blockui',
    'bootstrap',
    'angular',
    'angular-bootstrap'
], function() {
    'use strict';
    var jslibrary = angular.module('jslibrary', ['ui.bootstrap']),
            modalSimpleController = function($scope, $modalInstance, modal) {
                $scope.modal = modal;
                $scope.ok = function() {
                    $modalInstance.close(true);
                };
                $scope.close = function() {
                    $modalInstance.close(false);
                };
            },
            ngDelete = function() {
                return {
                    restrict: 'A',
                    scope: true,
                    controller: ['$scope', '$element', '$attrs', '$jsUrl', '$window', '$modal', '$timeout', function($scope, $element, $attrs, $jsUrl, $window, $modal, $timeout) {
                            $element.bind('click', function() {
                                $timeout(function() {
                                    var options = $scope.$eval($attrs.ngDelete);
                                    var d = $modal.open(options.optionsModal);
                                    d.result.then(function(result) {
                                        if (result)
                                            $().ajaxLoad({
                                                type: 'post',
                                                url: options.url,
                                                timeout: 15000,
                                                data: options.data,
                                                message: "Excluido...",
                                                success: function(Dados) {
                                                    $.unblockUI();
                                                    $jsUrl.goToPath(options.urlRedirect);
                                                },
                                                error: function(erro, status) {
                                                    if (erro.readyState == 0 || erro.status == 0)
                                                        return;
                                                    if (status == "timeout")
                                                        $().msgError("<strong>Por Favor, Tente Novamente!</strong>");
                                                    else
                                                        $(options.selectorMessage).showMessageErr(erro.responseText);
                                                }
                                            });
                                    });
                                    $window.setTimeout(function() {
                                        $('.modal').draggable({
                                            cursor: 'move'
                                        });
                                    }, 100);

                                });


                            });
                        }]
                };
            },
            /**
             * Diretivas atribuir a um modelo o valor do atributo value
             * use data-ng-initial
             */
            ngTriggerSubmitDirective = function() {
                return {
                    restrict: 'A',
                    controller: ['$scope', '$element', '$attrs', '$timeout', function($scope, $element, $attrs, $timeout) {
                            $($element).click(function(event) {
                                var $root = this;
                                $timeout(function() {
                                    $scope[$attrs.ngModel] = $attrs.value;
                                    $($root).closest('form').submit();
                                });
                            });
                        }]
                };
            },
            /**
             * Diretivas atribuir a um modelo o valor do atributo value
             * use data-ng-initial
             */
            ngInitialDirective = function() {
                return {
                    restrict: 'A',
                    controller: ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
                            var val, getter, setter;
                            if ($attrs.type === "checkbox" || $attrs.type === "radio") {
                                if ($attrs.type === "checkbox")
                                    val = $attrs.checked;
                                else if ($attrs.checked)
                                    val = $attrs.ngInitial || $attrs.value;
                            }
                            else
                                val = $attrs.ngInitial || $attrs.value;
                            if (val !== undefined) {
                                if ($attrs.varType == undefined)
                                    val = val === "" ? '' : val;
                                else
                                    val = Boolean(parseInt(val));
                                getter = $parse($attrs.ngModel);
                                setter = getter.assign;
                                return setter($scope, val);
                            }

                        }]
                };
            },
            /**
             * Diretivas para redirecionar a pagina atraves de um clique de um botao
             * use data-ng-gotopath
             */
            ngGotopathDirective = function() {
                'use strict';
                return {
                    restrict: 'A',
                    controller: ['$element', '$attrs', '$jsUrl', function($element, $attrs, $jsUrl) {
                            $element.bind('click', function() {
                                $jsUrl.goToPath($attrs.ngGotopath, $attrs.target);
                            });
                        }]
                };
            },
            ngMessagemodelDirective = function() {
                'use strict';
                return {
                    restrict: 'A',
                    scope: {
                        message: "=ngModel"
                    },
                    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                            $scope.$watch($attrs.ngModel, function(value) {
                                $element.html(value);
                            });
                        }]
                };
            },
            jsValidation = function($rootScope, $modal, $window) {
                var $root = this;

                this.selectorCodigo = "";
                this.optionsModal = {
                    backdrop: true,
                    keyboard: true,
                };
                this.validate = function(selectorForm) {
                    var validateMethod = validateMethod = $.fn.validate;
                    $.fn.validate = function(o) {
                        if (o && o.rules) {
                            for (var name in o.rules) {
                                var rule = o.rules[name];
                                if (rule.required === true) {
                                    var label = $('label[for=\'' + name + '\']');
                                    label.html("* " + label.html());
                                }
                            }
                        }
                        return $.proxy(validateMethod, this)(o);
                    };
                    $(selectorForm).validate($root.optionsValidation);
                };
                this.optionsValidation = {
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
                            if (label.length > 0)
                                $('label[for=\'' + el.attr('name') + '\']').ScrollTo({
                                    offsetTop: 49
                                });
                            else
                                $(els[0]).ScrollTo({
                                    offsetTop: 59
                                });
                        }
                    },
                    submitHandler: function(form) {
                        if ($($root.selectorCodigo).val() != "") {
                            $rootScope.$apply(function() {
                                var d = $modal.open($root.optionsModal);
                                d.result.then(function(result) {
                                    if (result)
                                        form.submit();
                                });
                                $window.setTimeout(function() {
                                    $('.modal').draggable({
                                        cursor: 'move'
                                    });
                                }, 100);
                            });
                        } else
                            form.submit();
                    }
                };
            },
            jsUrl = function($window) {
                'use strict';
                this.goToPath = function(url, target) {
                    if (target === undefined)
                        $window.location.href = url;
                    else
                        $window.open(url, target);
                };
            },
            jsTooltip = function($window) {
                'use strict';
                this.showTooltip = function(element, text, model) {
                    var el = $(element),
                            scope = angular.element(el).scope();
                    scope[model] = text;
                    $window.setTimeout(function() {
                        el.blur().focus();
                    }, 100);
                };
                this.hideTooltip = function(element, model) {
                    var el = $(element),
                            scope = angular.element(el).scope();
                    scope[model] = "";
                    $window.setTimeout(function() {
                        el.blur().focus();
                    }, 100);
                };
            };

    jslibrary.controller('ModalSimpleController', modalSimpleController);
    jslibrary.directive('ngDelete', [ngDelete]);
    jslibrary.directive('ngTriggersubmit', [ngTriggerSubmitDirective]);
    jslibrary.directive('ngInitial', [ngInitialDirective]);
    jslibrary.directive('ngGotopath', [ngGotopathDirective]);
    jslibrary.directive('ngMessagemodel', [ngMessagemodelDirective]);

    jslibrary.service('$jsUrl', jsUrl);
    jslibrary.service('$jsValidation', jsValidation);
    jslibrary.service('$jsTooltip', jsTooltip);
});