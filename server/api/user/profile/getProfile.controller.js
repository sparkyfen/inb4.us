'use strict';

var validator = require('validator');
var crypto = require('crypto');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();

function _validateRequest(userId, callback) {
  if(!validator.isUUID(userId)) {
    return callback('Invalid user id.');
  }
  return callback();
}

function _getUserById(userId, callback) {
  users.searchById(userId, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({status: 500, message: 'Could not get user profile.'});
    }
    if(reply.rows.length === 0) {
      return callback({status: 400, message: 'User does not exist.'});
    }
    var user = reply.rows[0].value;
    if(!user.active) {
      return callback({status: 400, message: 'You must activate this account before using it.'});
    }
    return callback(null, user);
  });
}

function _getUserByName(username, callback) {
  users.searchByUsername(username, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({status: 500, message: 'Could not get user profile.'});
    }
    if(reply.rows.length === 0) {
      return callback({status: 400, message: 'User does not exist.'});
    }
    var user = reply.rows[0].value;
    if(!user.active) {
      return callback({status: 400, message: 'You must activate this account before using it.'});
    }
    return callback(null, user);
  });
}

// Get profile based on session or based on incoming id.
exports.index = function(req, res) {
  var userId = req.param('id');
  // We don't have a session so we expect the user id value.
  if(validator.isNull(userId)) {
    // We have a session, look them up via username.
    var username = req.param('username');
    if(!username) {
      username = req.session.username;
      if(!username) {
        return res.status(400).jsonp({message: 'Missing username.'});
      }
    }
    // Get user from database.
    _getUserByName(username, function (error, user) {
      if(error) {
        return res.status(error.status).jsonp({message: error.message});
      }
      // Make sure we remove anything that we don't want to expose.
      delete user._rev;
      delete user.tokens;
      delete user.active;
      delete user.password;
      user.email = crypto.createHash('md5').update(user.email).digest('hex');
      return res.jsonp(user);
    });
  } else {
    // Validate user input.
    _validateRequest(userId, function (error) {
      if(error) {
        return res.status(400).jsonp({message: error});
      }
      // Get user from database.
      _getUserById(userId, function (error, user) {
        if(error) {
          return res.status(error.status).jsonp({message: error.message});
        }
        // Make sure we remove anything that we don't want to expose.
        delete user._rev;
        delete user.tokens;
        delete user.active;
        delete user.password;
        user.email = crypto.createHash('md5').update(user.email).digest('hex');
        return res.jsonp(user);
      });
    });
  }
};