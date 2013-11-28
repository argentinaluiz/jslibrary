var jslibrary = angular.module('jslibrary', []);

/**
 * Diretivas atribuir a um modelo o valor do atributo value
 * use data-ng-initial
 */
var ngInitialDirective = function() {
    'use strict';
    return {
        restrict: 'A',
        controller: ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
                var val = $attrs.ngInitial || $attrs.value,
                        getter = $parse($attrs.ngModel),
                        setter = getter.assign;
                return setter($scope, val);
            }]
    };
};

/**
 * Diretivas para redirecionar a pagina atraves de um clique de um botao
 * use data-ng-gotopath
 */
var ngGotopathDirective = function() {
    'use strict';
    return {
        restrict: 'A',
        controller: ['$element', '$attrs', '$jsUrl', function($element, $attrs, $jsUrl) {
                $element.bind('click', function() {
                    $jsUrl.goToPath($attrs.ngGotopath);
                });
            }]
    };
};

var ngMessagemodelDirective = function() {
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

var jsUrl = function($window) {
    'use strict';
    this.goToPath = function(url) {
        $window.location.href = url;
    };
};

var jsTooltip = function($window) {
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

jslibrary.directive('ngInitial', [ngInitialDirective]);
jslibrary.directive('ngGotopath', [ngGotopathDirective]);
jslibrary.directive('ngMessagemodel', [ngMessagemodelDirective]);

jslibrary.service('$jsUrl', jsUrl);
jslibrary.service('$jsTooltip', jsTooltip)