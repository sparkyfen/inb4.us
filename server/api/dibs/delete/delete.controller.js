'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();
var utils = db.utils;
utils.initialize();

function _validateUser(username, callback) {
  users.searchByUsername(username, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not delete dib.'});
    }
    if(reply.rows.length === 0) {
      return callback({code: 400, message: 'User does not exist.'});
    }
    var user = reply.rows[0].value;
    if(!user.active) {
      return callback({code: 400, message: 'You must activate this account before using it.'});
    }
    if(user.dibs.length === 0) {
      return callback({code: 400, message: 'User has no dibs.'});
    }
    return callback(null, user);
  });
}

// Delete dib from database.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var isAdmin = req.session.admin;
  var username = req.session.username;
  var id = req.body.id;
  if(validator.isNull(id)) {
    return res.status(400).jsonp({message: 'Missing id.'});
  }
  if(!validator.isUUID(id)) {
    return res.status(400).jsonp({message: 'Invalid id.'});
  }
  _validateUser(username, function (error, user) {
    if(error) {
      return res.status(error.code).jsonp({message: error.message});
    }
    dibs.searchById(id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not delete dib.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Dib does not exist.'});
      }
      var dib = reply.rows[0].value;
      if(dib.creator !== user._id && !isAdmin) {
        return res.status(400).jsonp({message: 'You are not allowed to delete this dib.'});
      }
      var dibIdIndex = user.dibs.indexOf(id);
      var dibId = user.dibs.splice(dibIdIndex, 1);
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not delete dib.'});
        }
        dibs.deleteById(dibId[0], function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not delete dib.'});
          }
          return res.jsonp({message: 'Dib deleted.'});
        });
      });
    });
  });
};
