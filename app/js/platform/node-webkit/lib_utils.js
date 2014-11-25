/*global angular, navigator*/
(function(angular) {
  'use strict';

  angular.module('winterpad')
    .factory('Utils', [

      function() {
        return {
          openExternal: function(url) {
            var gui = require('nw.gui');
            gui.Shell.openExternal(url);
          },
          isOnline: function() {
            return navigator.onLine;
          }
        };
      }
    ]);
}(angular));
