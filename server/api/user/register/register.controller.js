'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var url = require('url');
var uuid = require('node-uuid');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
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
  if(!validator.isLength(password, 7)) {
    return callback('Password must a minimum of 7 characters long.');
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
    templates(options.isAdmin ? 'adminRegister' : 'register', {
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
  var isAdmin = false;
  if(req.session.admin) {
    isAdmin = true;
  }
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
          return res.status(400).jsonp({message: 'User already registered with that username.'});
        }
        // Encrypt password
        bcrypt.hash(password, 10, function (error, hash) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not register user.'});
          }
          var userId = uuid.v4();
          userSchema.username = username;
          userSchema.password = hash;
          userSchema.email = email;
          userSchema.dates.created = Date.now(Date.UTC());
          userSchema.tokens.activate = uuid.v4();
          if(isAdmin) {
            userSchema.admin = true;
          }
          _getEmailTemplate({
            userId: userId,
            token: userSchema.tokens.activate,
            isAdmin: isAdmin
          }, function (error, emailBody) {
            if(error) {
              console.log(error);
              return res.status(500).jsonp({message: 'Could not register user.'});
            }
            if(config.env !== 'test') {
              var transport = nodemailer.createTransport(sgTransport({
                auth: {
                  api_user: config.email.accounts.sendgrid.username,
                  api_key: config.email.accounts.sendgrid.password
                }
              }));
              transport.sendMail({
                from: config.email.accounts.info,
                to: email,
                subject: isAdmin ? 'New Admin Account' : 'New Account',
                html: emailBody
              }, function (error, reply) {
                if(error) {
                  console.log(error);
                }
                console.log('Register user email sent for email '+ email + ' with email server reply of ' + reply.message);
              });
            }
            utils.insert(utils.users, userId, userSchema, function (error) {
              if(error) {
                console.log(error);
                return res.status(500).jsonp({message: 'Could not register user.'});
              }
              return res.jsonp({message: 'Registered, please check your email to activate your account.'});
            });
          });
        });
      });
    });
  });
};