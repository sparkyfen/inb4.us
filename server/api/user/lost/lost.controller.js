'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var url = require('url');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir = path.join(__dirname, '../../../components/emails/templates');
var db = require('../../../components/database');
var config = require('../../../config/environment');
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
  var resetUrl = url.resolve(config.domain, '/user/reset/');
  resetUrl = url.resolve(resetUrl, options.userId + '/');
  resetUrl = url.resolve(resetUrl, options.token + '/');
  emailTemplates(templatesDir, function (error, templates) {
    if(error) {
      return callback(error);
    }
    templates('lost', {
      resetUrl: resetUrl
    }, function (error, html, text) {
      if(error) {
        return callback(error);
      }
      return callback(null, html);
    });
  });
}

// Send email for user who has forgotten their password.
exports.index = function(req, res) {
  var email = req.body.email;
  _validateRequest(email, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    users.searchByEmail(email, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not send lost password email.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      var user = reply.rows[0].value;
      if(!user.active) {
        return res.status(400).jsonp({message: 'You must activate this account before using it.'});
      }
      user.tokens.reset = uuid.v4();
      _getEmailTemplate({
        userId: user._id,
        token: user.tokens.reset
      }, function (error, emailBody) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not send lost password email.'});
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
            subject: 'Reset Password',
            html: emailBody
          });
        }
        utils.insert(utils.users, user._id, user, function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not send lost password email.'});
          }
          return res.jsonp({message: 'Reset email sent.'});
        });
      });
    });
  });
};