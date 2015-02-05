/*global angular, $, window, _*/
'CordovaService', (function(angular, $) {
  'use strict';

  angular.module('winterpad')
    .controller('RootController', [
      '$scope',
      '$http',
      '$state',
      'Note',
      'Utils',
      'CordovaService',
      'Menu',
      function($scope, $http, $state, noteService, Utils, CordovaService) {
        CordovaService.ready.then(function resolved(resp) {
            var Note = null;
            $scope.error = false;
            $scope.scope = $scope;
            $scope.notes = [];

            var notesDb = new window.dica.Db();
            var configDb = new window.dica.Db();
            configDb.init('winterpad.configuration.db', function() {
              $scope.notesRestUrl = configDb.query({
                key: 'notesRestUrl'
              }).select('value')[0];
              $scope.notesRestUsername = configDb.query({
                key: 'notesRestUsername'
              }).select('value')[0];
              $scope.notesRestPassword = configDb.query({
                key: 'notesRestPassword'
              }).select('value')[0];
              if (_.isString($scope.notesRestUrl) && !_.isEmpty($scope.notesRestUrl.trim())) {
                Note = noteService($scope.notesRestUrl, $scope.notesRestUsername, $scope.notesRestPassword);
              } else {
                Note = null;
              }

              notesDb.init('winterpad.notes.db', function() {
                syncNotes();
              });
            });


            function addCreatedNotesToRemote() {
              var notes = null;
              var i = 0;
              if (Utils.isOnline() && null !== Note) {
                notes = notesDb.query({
                  localOnly: {
                    'is': true
                  }
                }).get();
                for (i = 0; i < notes.length; i++) {
                  pushCreatedNote(notes[i]);
                }
              }
            }

            function removeDeletedNotesFromRemote() {
              var notes = null;
              var i = 0;
              if (Utils.isOnline() && null !== Note) {
                notes = notesDb.query({
                  deleteIt: {
                    'is': true
                  }
                }).get();
                for (i = 0; i < notes.length; i++) {
                  pushDeletedNote(notes[i]);
                }
              }
            }

            function updateEditedNotesOnRemote() {
              var notes = null;
              var i = 0;
              if (Utils.isOnline() && null !== Note) {
                notes = notesDb.query({
                  editedLocal: {
                    'is': true
                  }
                }).get();
                for (i = 0; i < notes.length; i++) {
                  pushEditedNote(notes[i]);
                }
              }
            }

            function updateNoteView() {
              $scope.notes = notesDb.query(function() {
                return !this.deleteIt;
              }).order('modified desc').get();
            }

            function syncNotes() {
              updateNoteView();
              addCreatedNotesToRemote();
              removeDeletedNotesFromRemote();
              updateEditedNotesOnRemote();
              if (Utils.isOnline() && null !== Note) {
                var notes = Note.query(function() {
                  $scope.error = false;
                  var remoteNoteIds = _.pluck(notes, 'id');
                  var localNoteIds = notesDb.query().select('id');
                  var localNoteIdsThatAreNotRemote = _.difference(localNoteIds, remoteNoteIds);
                  var localNotesThatAreNotRemote = notesDb.query({
                    id: localNoteIdsThatAreNotRemote
                  }).get();
                  var notesViewNeedsUpdate = ($scope.notes.length < 1 && notes.length > 1);
                  localNotesThatAreNotRemote.forEach(function(possibleNoteToRemove) {
                    if (!possibleNoteToRemove.localOnly) {
                      possibleNoteToRemove.deleteIt = true;
                      notesDb.query.merge(possibleNoteToRemove, 'id');
                      notesViewNeedsUpdate = true;
                    }
                  });
                  notesDb.query.merge(notes, 'id');
                  if (notesViewNeedsUpdate) {
                    updateNoteView();
                  }
                  setTimeout(syncNotes, 600000);
                }, function(error) {
                  $scope.error = true;
                  $scope.message = error;
                  setTimeout(syncNotes, 600000);
                });
              } else {
                $scope.error = false;
                setTimeout(syncNotes, 600000);
              }
            }

            $scope.saveNote = function(content) {
              var note = {
                id: Date.now(),
                modified: Date.now(),
                localOnly: true,
                content: content,
                title: content.split('\n', 1)[0]
              };
              notesDb.query.insert(note);
              updateNoteView();
              $scope.newNoteContent = '';
              addCreatedNotesToRemote();
            };

            $scope.updateNote = function() {
              var id = parseInt($('#noteContentForUpdate').data('note'), 10);
              var content = $('#noteContentForUpdate').val();
              var note = notesDb.query({
                id: {
                  'is': id
                }
              }).first();
              note.content = content;
              note.title = content.split('\n', 1)[0];
              if (!note.localOnly) {
                note.editedLocal = true;
              }
              notesDb.query.merge(note, 'id');
              if (!note.localOnly) {
                updateEditedNotesOnRemote();
              }
              $('#noteContentForUpdate').val('');
              $('#noteContentForUpdate').data('note', '');
            };

            $scope.deleteNote = function() {
              var id = parseInt($('#noteIdToDelete').text(), 10);
              var note = notesDb.query({
                id: {
                  'is': id
                }
              }).first();
              if (note.localOnly) {
                notesDb.query({
                  id: {
                    'is': note.id
                  }
                }).remove();
              } else {
                note.deleteIt = true;
                notesDb.query.merge(note, 'id');
              }
              updateNoteView();
              $('#noteIdToDelete').text('');
              if (!note.localOnly) {
                removeDeletedNotesFromRemote();
              }
            };

            $scope.openDialogForNoteDeletion = function(noteId) {
              $('#noteIdToDelete').text(noteId);
            };

            $scope.openDialogForNoteUpdate = function(noteId, noteContent) {
              $('#noteContentForUpdate').data('note', noteId);
              $('#noteContentForUpdate').val(noteContent);
            };

            $scope.savePreferences = function(notesRestUrl, notesRestUsername, notesRestPassword) {
              configDb.query.merge({
                key: 'notesRestUrl',
                value: notesRestUrl
              }, 'key');
              configDb.query.merge({
                key: 'notesRestUsername',
                value: notesRestUsername
              }, 'key');
              configDb.query.merge({
                key: 'notesRestPassword',
                value: notesRestPassword
              }, 'key');
              $scope.notesRestUrl = notesRestUrl;
              $scope.notesRestUsername = notesRestUsername;
              $scope.notesRestPassword = notesRestPassword;
              if (_.isString($scope.notesRestUrl) && !_.isEmpty($scope.notesRestUrl.trim())) {
                Note = noteService($scope.notesRestUrl, $scope.notesRestUsername, $scope.notesRestPassword);
                syncNotes();
              } else {
                Note = null;
              }
            };

            function pushCreatedNote(note) {
              Note.save({
                content: note.content
              }).$promise.then(function(result) {
                notesDb.query({
                  id: {
                    'is': note.id
                  }
                }).remove();
                notesDb.query.merge(result, 'id');
                updateNoteView();
              }, function(error) {
                console.error('Error on remote note creation. ', error);
              });
            }

            function pushDeletedNote(note) {
              Note.remove({
                id: note.id
              }).$promise.then(function() {
                notesDb.query({
                  id: {
                    'is': note.id
                  }
                }).remove();
              }, function(error) {
                if (error.status === 404) {
                  notesDb.query({
                    id: {
                      'is': note.id
                    }
                  }).remove();
                } else {
                  console.warn('Error on remote note deletion. ', error);
                }
              });
            }

            function pushEditedNote(note) {
              Note.update({
                id: note.id
              }, {
                content: note.content
              }).$promise.then(function(result) {
                result.editedLocal = false;
                notesDb.query.merge(result, 'id');
                updateNoteView();
              }, function(error) {
                if (error.status === 404) {
                  console.warn('Note deleted on server. Delete it now locally.');
                  notesDb.query({
                    id: {
                      'is': note.id
                    }
                  }).remove();
                } else {
                  console.warn('Error on remote note update. ', error);
                }
              });
            }
          },
          function rejected(resp) {
            throw new Error(resp);
          }
        );
      }
    ]);
}(angular, $));
