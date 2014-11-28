'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var userSchema = require('../../../components/schema/user');
var db = require('../../../components/database');
var config = require('../../../config/environment');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();

function _validatePasswords(oldPass, newPass, confirmNew, callback) {
  if(validator.isNull(oldPass)) {
    return callback('Missing old password.');
  }
  if(validator.isNull(newPass)) {
    return callback('Missing new password.');
  }
  if(validator.isNull(confirmNew)) {
    return callback('Missing confirm new password.')
  }
  if(newPass !== confirmNew) {
    return callback('New passwords do not match.');
  }
  return callback();
}

// Get list of resetPasswords
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  var oldPass = req.body.old;
  var newPass = req.body.new;
  var confirmNew = req.body.confirm;
  _validatePasswords(oldPass, newPass, confirmNew, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    users.searchByUsername(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not log user in.'});
      }
      // User does not exist
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      // User exists, check their password
      var user = reply.rows[0].value;
      if(!user.active) {
        return res.status(400).jsonp({message: 'You must activate this account before using it.'});
      }
      bcrypt.compare(oldPass, user.password, function (error, isSame) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not reset password for user.'});
        }
        if(!isSame) {
          return res.status(400).jsonp({message: 'Passwords do not match.'});
        }
        delete req.session.username;
        return res.jsonp({message: 'Password reset, please log in again.'});
      });
    });
  });
};