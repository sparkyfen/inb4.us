'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var admins = db.admin;
admins.initialize();
var dibs = db.dib;
dibs.initialize();
var utils = db.utils;
utils.initialize();

// Deactivate a dib.
exports.index = function(req, res) {
  if((!req.session.username && !req.session.admin) || (!req.session.username)) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  if(!req.session.admin && req.session.username) {
    console.log('User ' + req.session.username + ' attempted to access the admin page.');
    return res.status(401).jsonp({message: 'Admins only.'});
  }
  var username = req.session.username;
  var id = req.body.id;
  if(validator.isNull(id)) {
    return res.status(400).jsonp({message: 'Missing id.'});
  }
  if(!validator.isUUID(id)) {
    return res.status(400).jsonp({message: 'Invalid id.'});
  }
  admins.searchByUsername(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not deactivate dib.'});
    }
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'Admin does not exist.'});
    }
    var admin = reply.rows[0].value;
    if(!admin.active) {
      return res.status(400).jsonp({message: 'You must activate this account before using it.'});
    }
    dibs.searchById(id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not deactivate dib.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Dib does not exist.'});
      }
      var dib = reply.rows[0].value;
      dib.active = false;
      utils.insert(utils.dibs, dib._id, dib, function (error) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not deactivate dib.'});
        }
        return res.jsonp({message: 'Dib deactivated.'});
      });
    });
  });
};