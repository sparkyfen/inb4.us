'use strict';

// Receive email from Sendgrid.net
exports.index = function(req, res) {
  var headers = req.body.headers;
  var text = req.body.text;
  var html = req.body.html;
  var from = req.body.from;
  var to = req.body.to;
  var cc = req.body.cc;
  var subject = req.body.subject;
  var dkim = req.body.dkim;
  var SPF = req.body.SPF;
  var envelope = req.body.envelope;
  var charsets = req.body.charsets;
  var spamScore = req.body.spam_score;
  var spamReport = req.body.spam_report;
  var attachments = req.body.attachments;
  var attachmentInfo = req.body['attachment-info'];
  console.log(req.body);
  return res.jsonp({message: 'Email recieved.'});
};