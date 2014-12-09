'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var dibs = db.dib;
dibs.initialize();
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

function _validateRequest(id, callback) {
  if(validator.isNull(id)) {
    return callback('Missing id.');
  }
  if(!validator.isUUID(id)) {
    return callback('Invalid id.');
  }
  return callback();
}

// Reset the dib view count.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var isAdmin = req.session.admin;
  var username = req.session.username;
  var id = req.body.id;
  _validateRequest(id, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    dibs.searchById(id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not reset dib view count.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Dib does not exist.'});
      }
      var dib = reply.rows[0].value;
      users.searchByUsername(username, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not reset dib view count.'});
        }
        if(reply.rows.length === 0) {
          return res.status(400).jsonp({message: 'User does not exist.'});
        }
        var user = reply.rows[0].value;
        if(!user.active) {
          return res.status(400).jsonp({message: 'You must activate this account before using it.'});
        }
        if(dib.creator !== user._id && !isAdmin) {
          return res.status(400).jsonp({message: 'You are not allowed to reset this dib.'});
        }
        dib.viewers = 0;
        utils.insert(utils.dibs, dib._id, dib, function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not reset dib view count.'});
          }
          return res.jsonp({message: 'Dib view count reset.'});
        });
      });
    });
  });
};