/*global angular, navigator*/
(function(angular) {
  'use strict';

  angular.module('winterpad')
    .factory('Utils', [

      function() {
        return {
          openExternal: function(url) {
            console.error('Should open the url ' + url + ' i a browser.');
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
