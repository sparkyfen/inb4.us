'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var adminSchema = require('../../../components/schema/admin');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var admins = db.admin;
admins.initialize();

function _validateLogin (username, password, callback) {
  if(validator.isNull(username)) {
    return callback('Missing username');
  }
  if(validator.isNull(password)) {
    return callback('Missing password');
  }
  return callback();
}

// Log admin into the site.
exports.index = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // Validate login user input.
  _validateLogin(username, password, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Search the database for the username.
    admins.searchByUsername(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not log admin in.'});
      }
      // User does not exist
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Username does not exist.'});
      }
      // Admin exists, check their password
      var admin = reply.rows[0].value;
      if(!admin.active) {
        return res.status(400).jsonp({message: 'You must activate this account before signing in.'});
      }
      bcrypt.compare(password, admin.password, function (error, isSame) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not log admin in.'});
        }
        if(!isSame) {
          return res.status(400).jsonp({message: 'Passwords do not match.'});
        }
        if(!validator.isNull(admin.tokens.reset)) {
          // The reset token was set, we can unset it here cause the admin signed in successfully.
          user.tokens.reset = null;
          utils.insert(utils.admins, admin._id, admin, function (error) {
            if(error) {
              console.log(error);
              return res.status(500).jsonp({message: 'Could not log admin in.'});
            }
            // Passwords are the same, lets log the user in.
            req.session.username = username;
            req.session.admin = true;
            return res.jsonp({message: 'Logged in.'});
          });
        } else {
          // Passwords are the same, lets log the user in.
          req.session.username = username;
          req.session.admin = true;
          return res.jsonp({message: 'Logged in.'});
        }
      });
    });
  });
};