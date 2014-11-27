/*global console, window, cordova, FileReader, webkitResolveLocalFileSystemURL, Blob*/
(function(window) {
  'use strict';

  function Filesystem() {

    function readFileInDirectory(directory, filePath, fileContentCallback, errorCallback) {
      directory.getFile(filePath, {}, function(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(event) {
            fileContentCallback(event.target.result);
          };
          reader.readAsText(file);
        }, errorCallback);
      }, errorCallback);
    }

    this.readFile = function(filePath, fileContentCallback, errorCallback) {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(directory) {
        readFileInDirectory(directory, filePath, fileContentCallback, errorCallback);
      }, function(error) {
        console.log(error);
      });
    };

    function writeFileInDirectory(directory, filePath, fileContent, successCallback) {
      directory.getFile(filePath, {
        create: true
      }, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
          fileWriter.onwriteend = function() {
            if (typeof successCallback === 'function') {
              successCallback();
            }
            console.log('Writing file ' + filePath + ' completed.');
          };
          fileWriter.onerror = function(e) {
            console.error('Writing file ' + filePath + ' failed: ' + e);
          };
          fileWriter.write(fileBlob);
        }, function(error) {
          console.error(error);
        });
      }, function(error) {
        console.error(error);
      });
    }

    this.writeFile = function(filePath, fileContent, successCallback) {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(directory) {
        writeFileInDirectory(directory, filePath, fileContent, successCallback);
      }, function(error) {
        console.error(error);
      });
    };
  }

  window.winterpad = window.winterpad || {};
  window.winterpad.FileSystem = window.winterpad.FileSystem || new Filesystem();
})(window);
