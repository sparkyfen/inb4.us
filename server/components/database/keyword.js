'use strict';

var config = require('../../config/environment');

exports.initialize = function() {
  this.nano = require('nano')({url: config.couchdb.url});
  this.keywords = this.nano.use(config.couchdb.keywords);
};

exports.compact = function (callback) {
  this.nano.db.compact(config.couchdb.keywords, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByName = function (name, callback) {
  this.keywords.view('keywords', 'by_name', {reduce: false, key: name}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchById = function (id, callback) {
  this.keywords.view('keywords', 'by_id', {reduce: false, key: id}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.getMultipleNames = function (names, callback) {
  this.keywords.view('keywords', 'by_name', {reduce: false, keys: names}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.getMultipleIds = function (ids, callback) {
  this.keywords.view('keywords', 'by_id', {reduce: false, keys: ids}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.getAll = function (callback) {
  this.keywords.view('keywords', 'all', {reduce: false}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.deleteById = function (id, callback) {
  var _self = this;
  _self.keywords.view('keywords', 'by_id', {reduce: false, key: id}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    if(reply.rows.length === 0) {
      return callback();
    }
    var docs = reply.rows.map(function (row) {
      row.value._deleted = true;
      return row.value;
    });
    console.log('Deleting keywords for user ' + id + ' from DB.');
    this.keywords.bulk({docs: docs}, function (error, reply, headers) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
  });
};

exports.bulk = function (docs, callback) {
  this.keywords.bulk({docs: docs}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};