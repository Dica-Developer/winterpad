/*global angular, navigator*/
(function(angular) {
  'use strict';

  angular.module('winterpad')
    .factory('Utils', [

      function() {
        return {
          openExternal: function(url) {
            window.open(url, '_system');
          },
          isOnline: function() {
            return navigator.connection.type !== Connection.NONE;
          },
          share: function(text) {
            window.plugins.socialsharing.share(text);
          }
        };
      }
    ]);
}(angular));
