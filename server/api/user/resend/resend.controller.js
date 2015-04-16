'use strict';

var validator = require('validator');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var emailTemplates = require('email-templates');
var path = require('path');
var url = require('url');
var templatesDir = path.join(__dirname, '../../../components/emails/templates');
var db = require('../../../components/database');
var config = require('../../../config/environment');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();

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

// Resends the activation email.
exports.index = function(req, res) {
  var email = req.body.email;
  if(validator.isNull(email)) {
    return res.status(400).jsonp({message: 'Missing email.'});
  }
  if(!validator.isEmail(email)) {
    return res.status(400).jsonp({message: 'Invalid email.'});
  }
  users.searchByEmail(email, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not resend activation email.'});
    }
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'Email is not registered.'});
    }
    var user = reply.rows[0].value;
    if(user.active || !user.tokens.activate) {
      return res.status(400).jsonp({message: 'User is already active.'});
    }
    if(user.locked) {
      return res.status(400).jsonp({message: 'Account is locked, please reset your password.'});
    }
    var isAdmin = false;
    if(user.admin) {
      isAdmin = true;
    }
    _getEmailTemplate({
      userId: user._id,
      token: user.tokens.activate,
      isAdmin: isAdmin
    }, function (error, emailBody) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not resend activation email.'});
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
      return res.jsonp({message: 'Activation email sent.'});
    });
  });
};