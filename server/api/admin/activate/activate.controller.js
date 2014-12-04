'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var admins = db.admin;
admins.initialize();

// Acticate the admin account
function _validateActivation(id, token, callback) {
  if(validator.isNull(id)) {
    return callback('Missing user id.');
  }
  if(validator.isNull(token)) {
    return callback('Missing activation token');
  }
  if(!validator.isUUID(id)) {
    return callback('Invalid user id.');
  }
  if(!validator.isUUID(token)) {
    return callback('Invalid activation token.');
  }
  return callback();
}

// Activate user account.
exports.index = function(req, res) {
  var id = req.body.id;
  var token = req.body.token;
  // Validate user input.
  _validateActivation(id, token, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Search for user based on admin id value.
    admins.searchById(id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not activate account.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      var admin = reply.rows[0].value;
      if(admin.tokens.activate !== token) {
        return res.status(400).jsonp({message: 'Invalid token for user.'});
      }
      // Change values in the object and save to database.
      admin.tokens.activate = null;
      admin.active = true;
      utils.insert(utils.admins, admin._id, admin, function (error) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not activate account.'});
        }
        return res.jsonp({message: 'Account activated.'});
      });
    });
  });
};