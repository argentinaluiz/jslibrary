var jslibrary = angular.module('jslibrary.ng.element', []),
        /**
         * Diretivas atribuir a um modelo o valor do atributo value
         * use data-ng-initial
         */
        ngInitialDirective = function() {
            'use strict';
            return {
                restrict: 'A',
                controller: ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
                        var val, getter, setter;
                        if ($attrs.type === "checkbox" || $attrs.type === "radio") {
                            if ($attrs.type === "checkbox" || $attrs.checked) {
                                val = $attrs.ngInitial || $attrs.value;
                            }
                            if ($attrs.type === "checkbox" && $attrs.value === undefined) {
                                val = Boolean(parseInt(val, 10));
                            }
                        }
                        else {
                            val = $attrs.ngInitial || $attrs.value;
                        }
                        getter = $parse($attrs.ngModel);
                        setter = getter.assign;
                        return setter($scope, val);
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
        };

jslibrary.directive('ngInitial', [ngInitialDirective]);
jslibrary.directive('ngMessagemodel', [ngMessagemodelDirective]);