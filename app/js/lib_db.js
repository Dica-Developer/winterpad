/*global TAFFY, window*/
(function(root) {
  'use strict';

  function Db() {
    var _dbName = null;
    this.query = null;
    this.lock = false;

    this.setDbName = function(dbName) {
      _dbName = dbName;
    };

    this.getDbName = function() {
      return _dbName;
    };
  }

  Db.prototype.save = function() {
    var db = this;
    this.lock = true;
    var dbContent = this.query().order('artist asec, album asec, year asec, track asec, title asec').get();
    this.query().remove();
    this.query.insert(dbContent);
    var serializedDb = JSON.stringify(dbContent),
      dbName = this.getDbName();

    root.FileSystem.writeFile(
      dbName,
      serializedDb,
      function() {
        db.lock = false;
      }
    );
  };

  Db.prototype.init = function(dbName, initReadyCallback) {
    var _db = this,
      _timeout = null,
      _dbName = 'db.' + dbName;

    this.setDbName(_dbName);

    root.FileSystem.readFile(_dbName, function(dbContent) {
      try {
        _db.query = new TAFFY(JSON.parse(dbContent));
      } catch (error) {
        console.error('Cannot initialize db with old content. Set it to an empty db.' + error);
        _db.query = new TAFFY();
      }
      _db.query.settings({
        cacheSize: 10000,
        onDBChange: function() {
          if (false === _db.lock) {
            if (null !== _timeout) {
              clearTimeout(_timeout);
            }
            _timeout = window.setTimeout(function() {
              _db.save();
            }, 10000);
          }
        }
      });
      if (initReadyCallback) {
        initReadyCallback();
      }
    }, function() {
      _db.query = new TAFFY();
      _db.query.settings({
        cacheSize: 10000,
        onDBChange: function() {
          if (false === _db.lock) {
            if (null !== _timeout) {
              clearTimeout(_timeout);
            }
            _timeout = window.setTimeout(function() {
              _db.save();
            }, 10000);
          }
        }
      });
      if (initReadyCallback) {
        initReadyCallback();
      }
    });
  };

  root.Db = Db;
}(window));
