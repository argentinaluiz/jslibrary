define([
    'angular',
    './directives/directive'
], function(angular) {
    'use strict';
    return angular.module('jslibrary', [
        'jslibrary.directives'
    ]);
});