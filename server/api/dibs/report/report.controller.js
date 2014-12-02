'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();
var utils = db.utils;
utils.initialize();

function _validateRequest(id, reason, callback) {
  if(validator.isNull(id)) {
    return callback('Missing id.');
  }
  if(!validator.isUUID(id)) {
    return callback('Invalid id.');
  }
  if(validator.isNull(reason)) {
    return callback('Missing reason.');
  }
  // TODO Sanitize reason report.
  return callback();
}

// Validates whether the dib can be reported.
function _validateDib(id, callback) {
  dibs.searchById(id, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not report dib.'});
    }
    if(reply.rows.length === 0) {
      return callback({code: 400, message: 'Dib does not exist.'});
    }
    var dib = reply.rows[0].value;
    if(!dib.active) {
      return callback({code: 400, message: 'Dib is not active, please reactivate it before reporting.'});
    }
    return callback(null, dib);
  });
}

// Validates whether the user can report this dib.
function _validateUser(username, dib, callback) {
  users.searchById(dib.creator, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not report dib.'});
    }
    if(reply.rows.length === 0) {
      return callback({code: 400, message: 'User does not exist.'});
    }
    var user = reply.rows[0].value;
    if(!user.active) {
      return callback({code: 400, message: 'You must activate this account before using it.'});
    }
    return callback(null, user);
  });
}

// Report a dib.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  var reason = req.body.reason;
  var id = req.body.id;
  _validateRequest(id, reason, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error})
    }
    _validateDib(id, function (error, dib) {
      if(error) {
        return res.status(error.code).jsonp({message: error.message});
      }
      if(dib.creator === username) {
        return res.status(400).jsonp({message: 'You cannot report your own dib, please delete it instead.'});
      }
      _validateUser(username, dib, function (error, user) {
        if(error) {
          return res.status(error.code).jsonp({message: error.message});
        }
        if(dib.report.reporter.indexOf(user._id) !== -1) {
          return res.status(400).jsonp({message: 'You have already reported this dib.'});
        }
        dib.report.reported = true;
        dib.report.count++;
        dib.report.seen.push(false);
        dib.report.reporter.push(user._id);
        dib.report.dates.push(Date.now(Date.UTC()));
        dib.report.reasons.push(reason);
        utils.insert(utils.dibs, dib._id, dib, function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not report dib.'});
          }
          return res.jsonp({message: 'Dib reported.'});
        });
      });
    });
  });
};