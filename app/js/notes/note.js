/*global angular, btoa*/
(function(angular) {
  'use strict';

  angular.module('winterpad')
    .factory('Note', ['$resource',

      function($resource) {
        return function(host, username, password) {
          var authentication = btoa(username + ':' + password);
          return $resource(host + '/:id',
            null, {
              'update': {
                url: host + '/:id',
                method: 'PUT',
                isArray: false,
                headers: {
                  'Authorization': 'Basic ' + authentication
                }
              },
              'get': {
                url: host + '/:id',
                method: 'GET',
                isArray: false,
                headers: {
                  'Authorization': 'Basic ' + authentication
                }
              },
              'save': {
                url: host,
                method: 'POST',
                isArray: false,
                headers: {
                  'Authorization': 'Basic ' + authentication
                }
              },
              'query': {
                url: host + '/:id',
                method: 'GET',
                isArray: true,
                headers: {
                  'Authorization': 'Basic ' + authentication
                }
              },
              'remove': {
                url: host + '/:id',
                method: 'DELETE',
                isArray: true,
                headers: {
                  'Authorization': 'Basic ' + authentication
                }
              },
              'delete': {
                url: host + '/:id',
                method: 'DELETE',
                isArray: true,
                headers: {
                  'Authorization': 'Basic ' + authentication
                }
              }
            }
          );
        };
      }
    ]);
}(angular));
