/*global console, window*/
(function(window) {
  'use strict';

  var fs = require('fs');

  function Filesystem() {

    var dataDirectory = require('nw.gui').App.dataPath;

    this.readFile = function(filePath, fileContentCallback, errorCallback) {
      fs.readFile(dataDirectory + '/' + filePath, function(error, data) {
        if (error) {
          if (errorCallback) {
            errorCallback(error);
          }
        } else {
          fileContentCallback(data);
        }
      });
    };

    this.writeFile = function(filePath, fileContent, successCallback) {
      fs.writeFile(dataDirectory + '/' + filePath, fileContent, function(error) {
        if (error) {
          console.error('Writing file ' + filePath + ' failed: ' + error);
        } else {
          if (typeof successCallback === 'function') {
            successCallback();
          }
          console.log('Writing file ' + filePath + ' completed.');
        }
      });
    };
  }

  window.FileSystem = new Filesystem();
})(window);
