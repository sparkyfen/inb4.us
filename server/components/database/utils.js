'use strict';

var config = require('../../config/environment');

exports.initialize = function() {
  this.nano = require('nano')({url: config.couchdb.url});
  this.users = this.nano.use(config.couchdb.users);
};

exports.create = function(dbName, callback) {
  this.nano.db.create(dbName, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.insert = function(db, key, data, callback) {
  db.insert(data, key, function (err, body, headers) {
    if(err) {
      return callback(err);
    }
    return callback(null);
  });
};