define(['jquery', 'angular'], function() {
    'use strict';
    var jslibrary = angular.module('jslibrary.ng.form', []),
            /**
             * Diretivas atribuir a um modelo o valor do atributo value
             * use data-ng-initial
             */
            ngTriggerSubmitDirective = function() {
                return {
                    restrict: 'A',
                    controller: ['$scope', '$element', '$attrs', '$timeout', function($scope, $element, $attrs, $timeout) {
                            $($element).click(function() {
                                var $root = this;
                                $timeout(function() {
                                    $scope[$attrs.ngModel] = $attrs.value;
                                    $($root).closest('form').submit();
                                });
                            });
                        }]
                };
            };

    jslibrary.directive('ngTriggersubmit', [ngTriggerSubmitDirective]);
});

