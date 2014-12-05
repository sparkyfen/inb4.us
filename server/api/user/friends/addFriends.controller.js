'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

function _validateRequest(friendName, username, callback) {
  if(validator.isNull(friendName)) {
    return callback('Missing friend name.');
  }
  if(friendName === username) {
    return callback('Cannot add yourself as a friend.');
  }
  return callback();
}

// Add friend to the database
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var friendName = req.body.username;
  var username = req.session.username;
  _validateRequest(friendName, username, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    users.getMultipleUsernames([username, friendName], function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not add friend.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User and friend do not exist.'});
      }
      if(reply.rows.length === 1 && reply.rows[0].value.username === friendName) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      if(reply.rows.length === 1 && reply.rows[0].value.username === username) {
        return res.status(400).jsonp({message: 'Friend does not exist.'});
      }
      var user = reply.rows[0].value;
      var friend = reply.rows[1].value;
      if(!user.active) {
        return res.status(400).jsonp({message: 'You must activate this account before using it.'});
      }
      if(!friend.active) {
        return res.status(400).jsonp({message: 'Your friend must activate their account before adding them.'});
      }
      user.friends.push(friend._id);
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not add friend.'});
        }
        return res.jsonp({message: 'Friend added.'});
      });
    });
  });
};