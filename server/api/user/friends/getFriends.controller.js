'use strict';

var validator = require('validator');
var crypto = require('crypto');
var _ = require('lodash');
var db = require('../../../components/database');
var users = db.user;
users.initialize();

// Get friends for user.
exports.index = function(req, res) {
  var username = req.param('username');
  if(!username) {
    username = req.session.username;
    if(!username) {
      return res.status(400).jsonp({message: 'Missing username.'});
    }
  }
  // Get user from the database
  users.searchByUsername(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not get friends.'});
    }
    // If the user does not exist, throw error.
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'User does not exist.'});
    }
    var user = reply.rows[0].value;
    // If the user is not active, throw error.
    if(!user.active) {
      return res.status(400).jsonp({message: 'You must activate this account before using it.'});
    }
    // If the user has no friends, return with no results.
    if(user.friends.length === 0) {
      return res.jsonp({message: 'No results.', results: []});
    }
    // Get the friend ids from the friend list.
    var friendIds = user.friends.map(function (friend) {
      return friend.id;
    });
    // Get all the friends from the database to get the friend objects.
    users.getMultipleIds(friendIds, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not get friends.'});
      }
      // Get users from the response
      var usersList = reply.rows.map(function (row) {
        return row.value;
      });
      // Get the user names
      var userObjs = usersList.map(function (userObj) {
        var acceptedIndex = friendIds.indexOf(userObj._id);
        return {
          id: userObj._id,
          username: userObj.username,
          email: crypto.createHash('md5').update(userObj.email).digest('hex'),
          firstname: userObj.firstname,
          lastname: userObj.lastname,
          accepted: user.friends[acceptedIndex].accepted
        };
      });
      return res.jsonp({message: 'Results found.', results: userObjs});
    });
  });
};