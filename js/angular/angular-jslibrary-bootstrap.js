define([
    'jquery',
    'angular-bootstrap'
], function() {
    'use strict';
    var jslibrary = angular.module('jslibrary.bootstrap', ['ui.bootstrap']),
            modalSimpleController = function($scope, $modalInstance, modal) {
                $scope.modal = modal;
                $scope.ok = function() {
                    $modalInstance.close(true);
                };
                $scope.close = function() {
                    $modalInstance.close(false);
                };
            },
            jsTooltip = function($timeout) {
                this.showTooltip = function(element, text, model) {
                    var el = $(element);
                    angular.element(el).scope()[model] = text;
                    $timeout(function() {
                        el.blur().focus();
                    }, 100);
                };
                this.hideTooltip = function(element, model) {
                    var el = $(element);
                    angular.element(el).scope()[model] = "";
                    $timeout(function() {
                        el.blur().focus();
                    }, 100);
                };
            };

    jslibrary.controller('ModalSimpleController', ['$scope', '$modalInstance', 'modal', modalSimpleController]);
    jslibrary.service('$jsTooltip', ['$timeout', jsTooltip]);
});