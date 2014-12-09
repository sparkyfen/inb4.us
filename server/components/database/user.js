'use strict';

var config = require('../../config/environment');

exports.initialize = function() {
  this.nano = require('nano')({url: config.couchdb.url});
  this.users = this.nano.use(config.couchdb.users);
};

exports.compact = function (callback) {
  this.nano.db.compact(config.couchdb.users, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByUsername = function (username, callback) {
  this.users.view('users', 'by_username', {reduce: false, key: username}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchPartialUsername = function(username, callback) {
  this.users.view('users', 'by_username', {reduce: false, startkey: username, limit: 50}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchById = function (id, callback) {
  this.users.view('users', 'by_id', {reduce: false, key: id}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchPartialId = function(id, callback) {
  this.users.view('users', 'by_id', {reduce: false, startkey: id}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.getMultipleUsernames = function(usernames, callback) {
  this.users.view('users', 'by_username', {reduce: false, keys: usernames}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByEmail = function (email, callback) {
  this.users.view('users', 'by_email', {reduce: false, key: email}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByAdmin = function(callback) {
  this.users.view('users', 'by_admin', {reduce: false}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByCreatedDate = function(date, callback) {
  this.users.view('users', 'by_created_date', {reduce: false, startkey: date}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.searchByInactiveCreatedDate = function(callback) {
  this.users.view('users', 'by_inactive_created_date', {reduce: false}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.getMultipleIds = function (ids, callback) {
  this.users.view('users', 'by_id', {reduce: false, keys: ids}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.getAll = function (callback) {
  this.users.view('users', 'all', {reduce: false}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

exports.deleteByUsername = function (username, callback) {
  var _self = this;
  _self.users.view('users', 'by_username', {reduce: false, key: username}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    if(reply.rows.length === 0) {
      return callback('User does not exist.');
    }
    var user = reply.rows[0].value;
    console.log('Deleting user from DB.');
    console.log(user);
    _self.users.destroy(user._id, user._rev, function (error, body, headers) {
      if(error) {
        return callback(error);
      }
      return callback(null, body);
    });
  });
};

exports.deleteByEmail = function (email, callback) {
  var _self = this;
  _self.users.view('users', 'by_email', {reduce: false, key: email}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    if(reply.rows.length === 0) {
      return callback('User does not exist.');
    }
    var user = reply.rows[0].value;
    console.log('Deleting user from DB.');
    console.log(user);
    _self.users.destroy(user._id, user._rev, function (error, body, headers) {
      if(error) {
        return callback(error);
      }
      return callback(null, body);
    });
  });
};

exports.bulk = function (docs, callback) {
  this.users.bulk({docs: docs}, function (error, reply, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};