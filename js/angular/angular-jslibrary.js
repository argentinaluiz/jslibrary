var jslibrary = angular.module('jslibrary', []);

jslibrary.directive('ngInitial', [function() {
        'use strict';
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {
                    var val = $attrs.ngInitial || $attrs.value;
                    var getter = $parse($attrs.ngModel);
                    var setter = getter.assign;
                    return setter($scope, val);
                }]
        };
    }]);