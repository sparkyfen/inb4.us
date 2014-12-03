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
var adminSchema = require('../../../components/schema/admin');
var db = require('../../../components/database');
var config = require('../../../config/environment');
var admins = db.admin;
admins.initialize();
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

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

function _getEmailTemplate(options, callback) {
  var activateUrl = url.resolve(config.domain, '/admin/activate/');
  activateUrl = url.resolve(activateUrl, options.userId + '/');
  activateUrl = url.resolve(activateUrl, options.token + '/');
  emailTemplates(templatesDir, function (error, templates) {
    if(error) {
      return callback(error);
    }
    templates('adminRegister', {
      activateUrl: activateUrl
    }, function (error, html, text) {
      if(error) {
        return callback(error);
      }
      return callback(null, html);
    });
  });
}

// Register new admin
exports.index = function(req, res) {
  if((!req.session.username && !req.session.admin) || (!req.session.username)) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  if(!req.session.admin && req.session.username) {
    return res.status(401).jsonp({message: 'Admins only.'});
  }
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  // Check input.
  _validateRegistration(username, email, password, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Check if email exists in admin database.
    admins.searchByEmail(email, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not register admin.'});
      }
      if(reply.rows.length !== 0) {
        return res.status(400).jsonp({message: 'Email already registered.'});
      }
      // Check if email exists in user database.
      users.searchByEmail(email, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not register admin.'});
        }
        if(reply.rows.length !== 0) {
          return res.status(400).jsonp({message: 'Email already registered.'});
        }
        // Check if username exists in admin database.
        admins.searchByUsername(username, function (error, reply) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not register admin.'});
          }
          if(reply.rows.length !== 0) {
            return res.status(400).jsonp({message: 'Admin already registered with that username.'});
          }
          // Check if username exists in user database.
          users.searchByUsername(username, function (error, reply) {
            if(error) {
              console.log(error);
              return res.status(500).jsonp({message: 'Could not register admin.'});
            }
            if(reply.rows.length !== 0) {
              return res.status(400).jsonp({message: 'User already registered with that username.'});
            }
            // Encrypt password
            bcrypt.hash(password, 10, function (error, hash) {
              if(error) {
                console.log(error);
                return res.status(500).jsonp({message: 'Could not register admin.'});
              }
              var adminId = uuid.v4();
              adminSchema.username = username;
              adminSchema.password = password;
              adminSchema.email = email;
              adminSchema.tokens.activate = uuid.v4();
              _getEmailTemplate({
                  userId: adminId,
                  token: adminSchema.tokens.activate
                }, function (error, emailBody) {
                  if(error) {
                    console.log(error);
                    return res.status(500).jsonp({message: 'Could not register admin.'});
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
                      subject: 'New Admin Account',
                      html: emailBody
                    }, function (error, reply) {
                      if(error) {
                        console.log(error);
                      }
                      console.log(reply);
                    });
                }
                utils.insert(utils.admins, adminId, adminSchema, function (error) {
                  if(error) {
                    console.log(error);
                    return res.status(500).jsonp({message: 'Could not register admin.'});
                  }
                  return res.jsonp({message: 'Registered, please check your email to activate your account.'});
                });
              });
            });
          });
        });
      });
    });
  });
};