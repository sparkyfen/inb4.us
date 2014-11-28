'use strict';

var validator = require('validator');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var path = require('path');
var url = require('url');
var uuid = require('node-uuid');
var templatesDir = path.join(__dirname, '../../../components/emails/templates');
var config = require('../../../config/environment');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();

function _validateRequest(email, callback) {
  if(validator.isNull(email)) {
    return callback('Missing email.');
  }
  if(!validator.isEmail(email)) {
    return callback('Invalid email.');
  }
  return callback();
}

function _getEmailTemplate(options, callback) {
  var activateUrl = url.resolve(config.domain, '/user/activate/');
  activateUrl = url.resolve(activateUrl, options.userId + '/');
  activateUrl = url.resolve(activateUrl, options.token + '/');
  emailTemplates(templatesDir, function (error, templates) {
    if(error) {
      return callback(error);
    }
    templates('updateProfile', {
      activateUrl: activateUrl
    }, function (error, html, text) {
      if(error) {
        return callback(error);
      }
      return callback(null, html);
    });
  });
}

function _emailUser(user) {
  _getEmailTemplate({
    userId: user._id,
    token: user.tokens.activate,
  }, function (error, emailBody) {
    if(error) {
      console.log(error);
    }
    if(config.env !== 'test') {
      var transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: config.email.accounts.info.username,
          pass: config.email.accounts.info.password
        }
      });
      transport.sendMail({
        from: config.email.accounts.info.username,
        to: user.email,
        subject: 'Update Profile',
        html: emailBody
      });
    }
  });
}

// Update user profile.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  // We can have blank first and last names but we need the email.
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  _validateRequest(email, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Get user from database.
    users.searchByUsername(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not update user profile.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      var user = reply.rows[0].value;
      if(!user.active) {
        return res.status(400).jsonp({message: 'You must activate this account before using it.'});
      }
      // Change any values that are changed.
      var editedUser = false;
      var emailUpdated = false;
      if(user.firstname !== firstname) {
        user.firstname = firstname;
        editedUser = true;
      }
      if(user.lastname !== lastname) {
        user.lastname = lastname;
        editedUser = true;
      }
      if(user.email !== email) {
        user.email = email;
        editedUser = true;
        user.active = false;
        emailUpdated = true;
        user.tokens.activate = uuid.v4();
        _emailUser(user);
      }
      // Updated database if needed.
      if(editedUser) {
        utils.insert(utils.users, user._id, user, function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not update user profile.'});
          }
          if(emailUpdated) {
            return res.jsonp({message: 'Profile updated, please reactivate your account.'});
          } else {
            return res.jsonp({message: 'Profile updated.'});
          }
        });
      } else {
        return res.jsonp({message: 'Nothing to change for profile.'});
      }
    });
  });
};