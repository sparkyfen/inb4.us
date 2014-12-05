'use strict';

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var config = require('../../config/environment');

// Receive email from Sendgrid.net
exports.index = function(req, res) {
  if(config.env !== 'test') {
      var transport = nodemailer.createTransport(sgTransport({
        auth: {
          api_user: config.email.accounts.sendgrid.username,
          api_key: config.email.accounts.sendgrid.password
        }
      }));
      transport.sendMail({
        from: config.email.accounts.forward.from,
        to: config.email.accounts.forward.to,
        cc: req.body.cc,
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html,
        attachments: req.body.attachments === '0' ? null : req.body.attachments
      }, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(400).jsonp({message: 'Email failed.'});
        }
        console.log(reply.message);
        return res.jsonp({message: 'Email recieved.'});
      });
  } else {
    return res.jsonp({message: 'Email recieved.'});
  }
};