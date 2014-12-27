/*global angular, $*/
(function(angular, $) {
  'use strict';

  /* Controllers */

  angular.module('winterpad')
    .controller('UtilController', ['$scope', 'Utils', '$interval',

      function($scope, Utils, $interval) {
        $scope.isOnline = false;

        $scope.openExternal = function(url) {
          Utils.openExternal(url);
        };

        $interval(function() {
          $scope.isOnline = Utils.isOnline();
        }, 5000);

        $scope.focusElement = function(element) {
          setTimeout(function() {
            $('#' + element).focus();
          }, 500);
        };
      }
    ]);
}(angular, $));
