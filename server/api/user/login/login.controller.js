'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var userSchema = require('../../../components/schema/user');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();

function _validateLogin (username, password, callback) {
  if(validator.isNull(username)) {
    return callback('Missing username');
  }
  if(validator.isNull(password)) {
    return callback('Missing password');
  }
  return callback();
}

// Logs the user in.
exports.index = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // Validate login user input.
  _validateLogin(username, password, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Search the database for the username.
    users.searchByUsername(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not log user in.'});
      }
      // User does not exist
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Username does not exist.'});
      }
      // User exists, check their password
      var user = reply.rows[0].value;
      if(!user.active) {
        return res.status(400).jsonp({message: 'You must activate this account before signing in.'});
      }
      bcrypt.compare(password, user.password, function (error, isSame) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not log user in.'});
        }
        if(!isSame) {
          return res.status(400).jsonp({message: 'Passwords do not match.'});
        }
        if(!validator.isNull(user.tokens.reset)) {
          // The reset token was set, we can unset it here cause the user signed in successfully.
          user.tokens.reset = null;
          utils.insert(utils.users, user._id, user, function (error) {
            if(error) {
              console.log(error);
              return res.status(500).jsonp({message: 'Could not log user in.'});
            }
            // Passwords are the same, lets log the user in.
            req.session.username = username;
            return res.jsonp({message: 'Logged in.'});
          });
        } else {
          // Passwords are the same, lets log the user in.
          req.session.username = username;
          return res.jsonp({message: 'Logged in.'});
        }
      });
    });
  });
};