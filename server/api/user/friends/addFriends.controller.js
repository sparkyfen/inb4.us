'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var admins = db.admin;
admins.initialize();
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

function _getAccounts(friendName, username, callback) {
  users.getMultipleUsernames([username, friendName], function (error, reply) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not add friend.'});
    }
    if(reply.rows.length === 0) {
      return callback({code: 400, message: 'User and friend do not exist.'});
    }
    if(reply.rows.length === 1 && reply.rows[0].value.username === friendName) {
      return callback({code: 400, message: 'User does not exist.'});
    }
    if(reply.rows.length === 1 && reply.rows[0].value.username === username) {
      var user = reply.rows[0].value;
      admins.searchByUsername(friendName, function (error, reply) {
        if(error) {
          console.log(error);
          return callback({code: 500, message: 'Could not add friend.'});
        }
        if(reply.rows.length === 0) {
          return callback({code: 400, message: 'Friend does not exist.'});
        }
        var friend = reply.rows[0].value;
        return callback(null, {user: user, friend: friend, isAdmin: true});
      });
    } else {
      var user = reply.rows[0].value;
      var friend = reply.rows[1].value;
      return callback(null, {user: user, friend: friend, isAdmin: false});
    }
  });
}

// Add friend to the database
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var friendName = req.body.username;
  var username = req.session.username;
  // Validate user input
  _validateRequest(friendName, username, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Get the friend and user account objects from the database.
    _getAccounts(friendName, username, function (error, userList) {
      if(error) {
        return res.status(error.code).jsonp({message: error.message});
      }
      var user = userList.user;
      var friend = userList.friend;
      var isAdmin = userList.isAdmin;
      if(!user.active) {
        return res.status(400).jsonp({message: 'You must activate this account before using it.'});
      }
      if(!friend.active) {
        return res.status(400).jsonp({message: 'Your friend must activate their account before adding them.'});
      }
      // Add friend id to the user object.
      user.friends.push({id: friend._id, accepted: true});
      friend.friends.push({id: user._id, accepted: false});
      if(isAdmin) {
        utils.insert(utils.admins, friend._id, friend, function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not add friend.'});
          }
          utils.insert(utils.users, user._id, user, function (error) {
            if(error) {
              console.log(error);
              return res.status(500).jsonp({message: 'Could not add friend.'});
            }
            return res.jsonp({message: 'Friend added.'});
          });
        });
      } else {
        users.bulk([user, friend], function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not add friend.'});
          }
          return res.jsonp({message: 'Friend added.'});
        });
      }
    });
  });
};