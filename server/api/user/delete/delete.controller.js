'use strict';

var _ = require('lodash');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();

// Deletes an account.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  // Delete all dibs associated with the user
  dibs.deleteByCreator(username, function (error) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not delete user profile.'});
    }
    // Get the user from the database.
    users.searchByUsername(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not delete user profile.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      var user = reply.rows[0].value;
      // Remove user immediately if they have no friends. :(
      if(user.friends.length === 0) {
        users.deleteByUsername(username, function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not delete user profile.'});
          }
          delete req.session.username;
          if(req.session.admin) {
            delete req.session.admin;
          }
          return res.jsonp({message: 'Profile deleted.'});
        });
      } else {
        // Get their friend ids
        var friendIds = user.friends.map(function (friend) {
          return friend.id;
        });
        // Get all their friend objects from the database.
        users.getMultipleIds(friendIds, function (error, reply) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not delete user profile.'});
          }
          // For each friend, update their friends list to remove the user being deleted.
          var friends = reply.rows.map(function (row) {
            var friendListIds = row.value.friends.map(function (friendFriend) {
              return friendFriend.id;
            });
            var friendIndex = friendListIds.indexOf(user._id);
            if(friendIndex === -1) {
              return row.value;
            } else {
              row.value.friends.splice(friendIndex, 1);
            }
            return row.value;
          });
          // Update database with updated friends objects.
          users.bulk(friends, function (error) {
            if(error) {
              console.log(error);
              return res.status(500).jsonp({message: 'Could not delete user profile.'});
            }
            // Delete user from the database.
            users.deleteByUsername(username, function (error) {
              if(error) {
                console.log(error);
                return res.status(500).jsonp({message: 'Could not delete user profile.'});
              }
              delete req.session.username;
              if(req.session.admin) {
                delete req.session.admin;
              }
              return res.jsonp({message: 'Profile deleted.'});
            });
          });
        });
      }
    });
  });
};