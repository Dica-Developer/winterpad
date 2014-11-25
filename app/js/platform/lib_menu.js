/*global document, angular*/
(function(angular, document) {
  'use strict';

  angular.module('winterpad')
    .factory('Menu', [

      function() {
        var gui = require('nw.gui');

        function Menu(cutLabel, copyLabel, pasteLabel) {
          var menu = new gui.Menu({
            type: 'menubar'
          });
          var cut = new gui.MenuItem({
            label: cutLabel || 'Cut',
            click: function() {
              document.execCommand('cut');
              console.log('Menu:', 'cutted to clipboard');
            }
          });

          var copy = new gui.MenuItem({
            label: copyLabel || 'Copy',
            click: function() {
              document.execCommand('copy');
              console.log('Menu:', 'copied to clipboard');
            }
          });

          var paste = new gui.MenuItem({
            label: pasteLabel || 'Paste',
            click: function() {
              document.execCommand('paste');
              console.log('Menu:', 'pasted to textarea');
            }
          });

          menu.append(cut);
          menu.append(copy);
          menu.append(paste);

          return menu;
        }

        if (process.platform === 'darwin') {
          var menu = new gui.Menu({
            type: 'menubar'
          });
          menu.createMacBuiltIn();
          gui.Window.get().menu = ;

        } else {
          gui.Window.get().menu = new Menu();
        }
      }
    ]);
}(angular, document));
