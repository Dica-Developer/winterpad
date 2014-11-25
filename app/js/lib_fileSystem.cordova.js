/*global console, window, cordova, FileReader, webkitResolveLocalFileSystemURL*/
(function(window) {
  'use strict';

  function Filesystem() {

    var dataDirectory = cordova.file.dataDirectory;

    var resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || webkitResolveLocalFileSystemURL;

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
      resolveLocalFileSystemURL(dataDirectory, function(directory) {
        readFileInDirectory(directory, filePath, fileContentCallback, errorCallback);
      }, function(error) {
        console.log(error);
      });
    };

    function writeFileInDirectory(directory, filePath, fileBlob, successCallback) {
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

    this.writeFile = function(filePath, fileBlob, successCallback) {
      resolveLocalFileSystemURL(dataDirectory, function(directory) {
        writeFileInDirectory(directory, filePath, fileBlob, successCallback);
      }, function(error) {
        console.error(error);
      });
    };
  }

  window.FileSystem = new Filesystem();
})(window);
