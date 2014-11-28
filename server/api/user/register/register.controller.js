'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var url = require('url');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir = path.join(__dirname, '../../../components/emails/templates');
var userSchema = require('../../../components/schema/user');
var db = require('../../../components/database');
var config = require('../../../config/environment');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();

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

function _getEmailTemplate(options, callback) {
  var activateUrl = url.resolve(config.domain, '/user/activate/');
  activateUrl = url.resolve(activateUrl, options.userId + '/');
  activateUrl = url.resolve(activateUrl, options.token + '/');
  emailTemplates(templatesDir, function (error, templates) {
    if(error) {
      return callback(error);
    }
    templates('register', {
      activateUrl: activateUrl
    }, function (error, html, text) {
      if(error) {
        return callback(error);
      }
      return callback(null, html);
    });
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
            _getEmailTemplate({
              userId: userId,
              token: userSchema.tokens.activate
            }, function (error, emailBody) {
              if(error) {
                console.log(error);
                return res.status(500).jsonp({message: 'Could not register user.'});
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
                  to: email,
                  subject: 'New Account',
                  html: emailBody
                });
              }
              return res.jsonp({message: 'Registered, please check your email to activate your account.'});
            });
          });
        });
      });
    });
  });
};