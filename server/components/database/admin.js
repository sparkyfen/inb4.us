'use strict';

var config = require('../../config/environment');

exports.initialize = function() {
  this.nano = require('nano')({url: config.couchdb.url});
  this.admins = this.nano.use(config.couchdb.admins);
};