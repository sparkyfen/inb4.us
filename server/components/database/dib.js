'use strict';

var config = require('../../config/environment');

exports.initialize = function() {
  this.nano = require('nano')({url: config.couchdb.url});
  this.dibs = this.nano.use(config.couchdb.dibs);
};

exports.compact = function (callback) {
  this.nano.db.compact(config.couchdb.dibs, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByName = function (name, callback) {
  this.dibs.view('dibs', 'by_name', {reduce: false, key: name}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchById = function (id, callback) {
  this.dibs.view('dibs', 'by_id', {reduce: false, key: id}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByCreator = function (creator, callback) {
  this.dibs.view('dibs', 'by_creator', {reduce: false, key: creator}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByDateCreated = function (dateCreated, callback) {
  this.dibs.view('dibs', 'by_date_created', {reduce: false, key: dateCreated}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByReported = function (callback) {
  this.dibs.view('dibs', 'by_reported', {reduce: false}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.getMultipleIds = function (ids, callback) {
  this.dibs.view('dibs', 'by_id', {reduce: false, keys: ids}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.getAll = function (callback) {
  this.dibs.view('dibs', 'all', {reduce: false}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.deleteByUsername = function (username, callback) {
  var _self = this;
  _self.dibs.view('dibs', 'by_username', {reduce: false, key: username}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    if(reply.rows.length === 0) {
      return callback('User does not exist.');
    }
    var user = reply.rows[0].value;
    console.log('Deleting user from DB.');
    console.log(user);
    _self.dibs.destroy(user._id, user._rev, function (error, body, headers) {
      if(error) {
        return callback(error);
      }
      return callback(null, body);
    });
  });
};

exports.deleteByEmail = function (email, callback) {
  var _self = this;
  _self.dibs.view('dibs', 'by_email', {reduce: false, key: email}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    if(reply.rows.length === 0) {
      return callback('User does not exist.');
    }
    var user = reply.rows[0].value;
    console.log('Deleting user from DB.');
    console.log(user);
    _self.dibs.destroy(user._id, user._rev, function (error, body, headers) {
      if(error) {
        return callback(error);
      }
      return callback(null, body);
    });
  });
};

exports.bulk = function (docs, callback) {
  this.dibs.bulk({docs: docs}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};