define([
    'jquery',
    'jquery.ajax_load',
    'jquery.msg',
    'blockui',
    'angular',
    'angular-jslibrary-ajax-resources',
    'angular-jslibrary-url'
], function() {
    'use strict';
    $(function() {
        var jslibrary = angular.module('jslibrary.delete', ['jslibrary.ajax', 'jslibrary.url']),
                ngDelete = function() {
                    return {
                        restrict: 'A',
                        scope: {
                            "optionsDelete": "=ngModel"
                        },
                        controller: ['$scope', '$element', '$jsAjax', '$jsUrl', '$timeout', function($scope, $element, $jsAjax, $jsUrl, $timeout) {
                                $scope.ajaxOptions = {
                                    type: 'post',
                                    url: '',
                                    timeout: 100,
                                    message: "Excluido...",
                                    success: function() {
                                        $.unblockUI();
                                        $jsUrl.goToPath($scope.optionsDelete.urlRedirect);
                                    },
                                    error: function(erro, status) {
                                        if (erro.readyState === 0 || erro.status === 0) {
                                            return;
                                        }
                                        if (status === "timeout") {
                                            $().msgError("<strong>Por Favor, Tente Novamente!</strong>");
                                        }
                                        else {
                                            $($scope.optionsDelete.selectorMessage).showMessageErr(erro.responseText);
                                        }
                                    }
                                };
                                $element.bind('click', function() {
                                    $timeout(function() {
                                        var options = $scope.optionsDelete;
                                        $scope.ajaxOptions.url = options.ajax.url;
                                        $scope.urlRedirect = options.urlRedirect;
                                        $scope.selectorMessage = options.selectorMessage;
                                        $jsAjax.ajaxWithModal({
                                            ajax: $.extend({}, $scope.ajaxOptions, options.ajax),
                                            modal: options.modal
                                        });
                                    });
                                });
                            }]
                    };
                };
        jslibrary.directive('ngDelete', [ngDelete]);
    });
});