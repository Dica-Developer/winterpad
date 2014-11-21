/*global angular, btoa, $*/
(function(angular, $) {
  'use strict';

  /* Controllers */

  angular.module('winterpad')
    .controller('RootController', [
      '$scope',
      '$http',
      '$state',
      function($scope, $http, $state) {
        function saveNote() {
          $http({
            'headers': {
              'Authorization': 'Basic ' + btoa('martin:4vnte23NAI')
            },
            'method': 'post',
            'url': 'https://findeichscha.de/owncloud/index.php/apps/notes/api/v0.2/notes',
            'data': {
              'content': $('#newNoteContent').val()
            }
          }).success(function(result) {
            $('#newNoteContent').val('');
            $scope.notes.push(result);
            $scope.error = false;
            $state.go('index');
          }).error(function(error) {
            $scope.error = true;
            $scope.message = error;
          });
        }

        function updateNote() {
          $http({
            'headers': {
              'Authorization': 'Basic ' + btoa('martin:4vnte23NAI')
            },
            'method': 'put',
            'url': 'https://findeichscha.de/owncloud/index.php/apps/notes/api/v0.2/notes/' + encodeURIComponent($('#noteContentForUpdate').data('note')),
            'data': {
              'content': $('#noteContentForUpdate').val()
            }
          }).success(function(result) {
            $('#noteContentForUpdate').text('');
            $('#noteContentForUpdate').data('note', '');
            $scope.notes.push(result);
            $scope.error = false;
          }).error(function(error) {
            $scope.error = true;
            $scope.message = error;
          });
        }

        function deleteNote() {
          $http({
            'headers': {
              'Authorization': 'Basic ' + btoa('martin:4vnte23NAI')
            },
            'method': 'delete',
            'url': 'https://findeichscha.de/owncloud/index.php/apps/notes/api/v0.2/notes/' + encodeURIComponent($('#noteIdToDelete').text())
          }).success(function() {
            $('#noteIdToDelete').val('');
            $scope.error = false;
          }).error(function() {
            $scope.error = true;
            $scope.message = 'Note to delete does not exist.';
          });
        }

        function openDialogForNoteDeletion(ev) {
          $('#noteIdToDelete').text($(ev.currentTarget).data('note'));
        }

        function openDialogForNoteUpdate(ev) {
          $('#noteContentForUpdate').data('note', $(ev.currentTarget).data('note'));
          $('#noteContentForUpdate').val($('#noteContent_' + $(ev.currentTarget).data('note')).text());
        }

        $scope.error = false;
        $http({
          'headers': {
            'Authorization': 'Basic ' + btoa('martin:4vnte23NAI')
          },
          'method': 'get',
          'url': 'https://findeichscha.de/owncloud/index.php/apps/notes/api/v0.2/notes'
        })
          .success(function(result) {
            $scope.updateNote = updateNote;
            $scope.openDialogForNoteUpdate = openDialogForNoteUpdate;
            $scope.saveNote = saveNote;
            $scope.deleteNote = deleteNote;
            $scope.openDialogForNoteDeletion = openDialogForNoteDeletion;
            /*result = _.sortBy(result, function(note) {
              return note.modified;
            });*/
            $scope.notes = result;
            $scope.error = false;
          }).error(function(error) {
            $scope.error = true;
            $scope.message = error;
          });
      }
    ]);
}(angular, $));
