/*global angular*/
(function(angular) {
  'use strict';

  angular.module('winterpad')
    .config(['$stateProvider', '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise(function($injector, $location) {
          console.warn('Url "' + $location.$$url + '" not found.');
          return '/';
        });
        // Now set up the states
        $stateProvider
          .state('index', {
            url: '/',
            templateUrl: '../templates/root.html',
            controller: 'RootController'
          });
      }
    ]);
}(angular));
