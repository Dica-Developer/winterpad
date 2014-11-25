/*global angular, window*/
(function(angular) {
  'use strict';

  if (typeof window._ === 'undefined') {
    window._ = require('lodash');
  }

  angular.module('winterpad', [
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'ngSanitize',
    'ngResource',
    'ngMarkdown'
  ]);
}(angular));
