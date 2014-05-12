define([
    'jquery',
    'jquery.ui',
    'jquery.ajax_load',
    'bootstrap',
    'angular-bootstrap'
], function() {
    'use strict';
    var jslibrary = angular.module('jslibrary.ajax', ['ui.bootstrap']),
            jsAjaxResources = function($modal, $timeout) {
                this.modalInstance = null;
                this.ajaxWithModal = function(options) {
                    this.modalInstance = $modal.open(options.modal);
                    this.modalInstance.result.then(function(result) {
                        if (result) {
                            $(this).ajaxLoad(options.ajax);
                        }
                    });
                    this.modalInstance.opened.then(function() {
                            $timeout(function() {
                                $('.modal').find('.modal-footer').find('button').eq(0).focus();
                                $('.modal').draggable({cursor: 'move'
                                });
                            }, 100);
                    });
                };
            };
    jslibrary.service('$jsAjax', ['$modal', '$timeout', jsAjaxResources]);
});