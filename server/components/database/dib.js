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

exports.deleteByCreator = function (creator, callback) {
  var _self = this;
  _self.dibs.view('dibs', 'by_creator', {reduce: false, key: creator}, function (error, reply, headers) {
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
    console.log('Deleting dibs for user ' + creator + ' from DB.');
    this.dibs.bulk({docs: docs}, function (error, reply, headers) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
  });
};

exports.deleteById = function (id, callback) {
  var _self = this;
  _self.dibs.view('dibs', 'by_id', {reduce: false, key: id}, function (error, reply, headers) {
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
    console.log('Deleting dibs for user ' + creator + ' from DB.');
    this.dibs.bulk({docs: docs}, function (error, reply, headers) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
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