'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();

function _validateRequest(obj, callback) {
  if(validator.isNull(obj.id)) {
    return callback('Missing user id.');
  }
  if(validator.isNull(obj.token)) {
    return callback('Missing reset token.');
  }
  if(validator.isNull(obj.new)) {
    return callback('Missing new password.');
  }
  if(validator.isNull(obj.confirm)) {
    return callback('Missing confirmed password.');
  }
  if(obj.new !== obj.confirm) {
    return callback('New passwords do not match.');
  }
  if(!validator.isUUID(obj.id)) {
    return callback('Invalid user id.');
  }
  if(!validator.isUUID(obj.token)) {
    return callback('Invalid reset token.');
  }
  return callback();
}

// Reset the user password given the token and new password.
exports.index = function(req, res) {
  var userid = req.body.id;
  var token = req.body.token;
  var newPass = req.body.new;
  var confirmNew = req.body.confirm;
  _validateRequest({
    id: userid,
    token: token,
    new: newPass,
    confirm: confirmNew
  }, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    users.searchById(userid, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not reset user password.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      var user = reply.rows[0].value;
      if(validator.isNull(user.tokens.reset)) {
        return res.status(400).jsonp({message: 'A reset token was not issued for this user.'});
      }
      if(user.tokens.reset !== token) {
        return res.status(400).jsonp({message: 'Invalid token for requested id.'});
      }
      bcrypt.hash(newPass, 10, function (error, hash) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not reset user password.'});
        }
        user.password = hash;
        user.tokens.reset = null;
        utils.insert(utils.users, user._id, user, function (error, reply) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not reset user password.'});
          }
          return res.jsonp({message: 'Password reset.'});
        });
      });
    });
  });
};