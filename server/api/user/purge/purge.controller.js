'use strict';

var validator = require('validator');
var config = require('../../../config/environment');
var db = require('../../../components/database');
var users = db.user;
users.initialize();

// Purge inactive accounts.
exports.index = function(req, res) {
  if((!req.session.username && !req.session.admin) || (!req.session.username)) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  if(!req.session.admin && req.session.username) {
    console.log('User ' + req.session.username + ' attempted to access the user purge page.');
    return res.status(401).jsonp({message: 'Admins only.'});
  }
  var username = req.session.username;
  var datetime = req.body.datetime;
  if(validator.isNull(datetime)) {
    datetime = Date.now(Date.UTC());
  }
  if(!validator.isInt(datetime)) {
    return res.status(400).jsonp({message: 'Invalid datetime.'});
  }
  users.searchByInactiveCreatedDate(function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not purge inactive accounts.'});
    }
    if(reply.rows.length === 0) {
      return res.jsonp({message: 'No accounts to purge.', results: []});
    }
    var docs = reply.rows.map(function (row) {
      if(datetime > (row.value.dates.created + config.dates.purgeTime)) {
        row.value._deleted = true;
      }
      return row.value;
    });
    var accounts = [];
    for (var i = 0; i < docs.length; i++) {
      var doc = docs[i];
      if(doc._deleted) {
        accounts.push({id: doc._id, username: doc.username});
      }
    }
    if(accounts.length === 0) {
      return res.jsonp({message: 'No accounts to purge.', results: []});
    }
    users.bulk(docs, function (error) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not purge inactive accounts.'});
      }
      return res.jsonp({message: 'Accounts purged.', results: accounts});
    });
  });
};