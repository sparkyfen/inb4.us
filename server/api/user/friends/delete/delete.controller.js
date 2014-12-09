'use strict';

var validator = require('validator');
var db = require('../../../../components/database');
var users = db.user;
users.initialize();

function _validateRequest(id, callback) {
  if(validator.isNull(id)) {
    return callback('Missing id.');
  }
  if(!validator.isUUID(id)) {
    return callback('Invalid id.');
  }
  return callback();
}

// Delete friend from users friend list
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  var id = req.body.id;
  // Validate user input
  _validateRequest(id, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Search for user in the database.
    users.searchByUsername(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not delete friend.'});
      }
      // User does not exist, throw error.
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      var user = reply.rows[0].value;
      // User account is not active, throw error.
      if(!user.active) {
        return res.status(400).jsonp({message: 'You must activate this account before using it.'});
      }
      if(user.friends.length === 0) {
        return res.status(400).jsonp({message: 'User has no friends to delete.'});
      }
      // Get the user's friend ids in a list.
      var friendIds = user.friends.map(function (friend) {
        return friend.id;
      });
      // Find their friend in the list.
      var friendIdIndex = friendIds.indexOf(id);
      // The requested user is not their friend.
      if(friendIdIndex === -1) {
        return res.status(400).jsonp({message: 'Friend does not exist for user.'});
      }
      // Remove user from friends list.
      user.friends.splice(friendIdIndex, 1);
      // Lookup friend by their id.
      users.searchById(id, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not delete friend.'});
        }
        // Friend does not exist in the database.
        if(reply.rows.length === 0) {
          return res.status(400).jsonp({message: 'Friend does not exist.'});
        }
        var friend = reply.rows[0].value;
        // If their friend is not active, we still should delete the user from their friends friend list.
        var friendFriendIds = friend.friends.map(function (friend) {
          return friend.id;
        });
        var userIdIndex = friendFriendIds.indexOf(user._id);
        if(userIdIndex === -1) {
          return res.status(400).jsonp({message: 'User does not exist for friend.'});
        }
        friend.friends.splice(userIdIndex, 1);
        users.bulk([user, friend], function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not delete friend.'});
          }
          return res.jsonp({message: 'Friend deleted.'});
        });
      });
    });
  });
};