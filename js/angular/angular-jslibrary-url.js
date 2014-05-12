var jslibrary = angular.module('jslibrary.url', []),
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
        jsUrl = function($window) {
            'use strict';
            this.goToPath = function(url) {
                $window.location.href = url;
            };
            this.openPath = function(url) {
                $window.open(url);
            };
        };

jslibrary.directive('ngGotopath', [ngGotopathDirective]);
jslibrary.service('$jsUrl', ['$window', jsUrl]);