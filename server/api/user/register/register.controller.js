'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();
var userSchema = require('../../../components/schema/user');

function _validateRegistration(username, email, password, callback) {
  if(validator.isNull(username)) {
    return callback('Missing username.');
  }
  if(validator.isNull(email)) {
    return callback('Missing email.');
  }
  if(!validator.isEmail(email)) {
    return callback('Invalid email.');
  }
  if(validator.isNull(password)) {
    return callback('Missing password.');
  }
  return callback();
}

function _encryptPassword(password, callback) {
  bcrypt.hash(password, 10, function (error, hash) {
    if(error) {
      return callback(error);
    }
    return callback(null, hash);
  });
}

// Registers a new user.
exports.index = function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  // Check input.
  _validateRegistration(username, email, password, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Check if email exists in database.
    users.searchByEmail(email, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not register user.'});
      }
      if(reply.rows.length !== 0) {
        return res.status(400).jsonp({message: 'Email already registered.'});
      }
      // Check if username exists in database.
      users.searchByUsername(username, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not register user.'});
        }
        if(reply.rows.length !== 0) {
          return res.status(400).jsonp({message: 'Username already registered.'});
        }
        // Encrypt password
        _encryptPassword(password, function (error, hash) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not register user.'});
          }
          var userId = userSchema.id;
          userSchema.username = username;
          userSchema.password = hash;
          userSchema.email = email;
          delete userSchema.id;
          utils.insert(utils.users, userId, userSchema, function (error) {
            if(error) {
              console.log(error);
              return res.status(500).jsonp({message: 'Could not register user.'});
            }
            // TODO Send email out to the user telling them they registered successfully.
            return res.jsonp({message: 'Registered, please check your email to activate your account.'});
          });
        });
      });
    });
  });
};