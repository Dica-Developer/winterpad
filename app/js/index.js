/*global angular*/
(function (angular) {
  'use strict';

  angular.module('winterpad', [
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'cfp.hotkeys',
    'LocalStorageModule',
    'ngSanitize',
    'ngAnimate'
  ]).config(['localStorageServiceProvider',
    function (localStorageServiceProvider) {
      localStorageServiceProvider.setPrefix('winterpad');
    }
  ]);
}(angular));
