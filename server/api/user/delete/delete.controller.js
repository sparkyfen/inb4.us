'use strict';

var _ = require('lodash');
var db = require('../../../components/database');
var admins = db.admin;
admins.initialize();
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();

function _updateAdminFriends(adminIds, userId, callback) {
  if(adminIds.length === 0) {
    return callback();
  }
  admins.getMultipleIds(adminIds, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not delete profile.'});
    }
    if(reply.rows.length !== adminIds.length) {
      return callback({code: 400, message: 'One or more admin friend(s) do(es) not exist.'});
    }
    var adminList = reply.rows.map(function (row) {
      var adminFriendIds = row.value.friends.map(function (friend) {
        return friend.id;
      });
      var adminFriendIndex = adminFriendIds.indexOf(userId);
      if(adminFriendIndex === -1) {
        return row.value;
      } else {
        row.value.friends.splice(adminFriendIndex, 1);
        return row.value;
      }
    });
    admins.bulk(adminList, function (error) {
      if(error) {
        console.log(error);
        return callback({code: 500, message: 'Could not delete profile.'});
      }
      return callback();
    });
  });
}

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
          var adminIds = [];
          // For each friend, update their friends list to remove the user being deleted.
          var friends = reply.rows.map(function (row) {
            var friendListIds = row.value.friends.map(function (friendFriend) {
              return friendFriend.id;
            });
            var friendAdminIds = _.difference(friendIds, friendListIds);
            adminIds.push(friendAdminIds);
            var friendIndex = friendListIds.indexOf(user._id);
            if(friendIndex === -1) {
              return row.value;
            } else {
              row.value.friends.splice(friendIndex, 1);
            }
            return row.value;
          });
          var adminIdsFlat = adminIds.reduce(function (a, b) {
            return a.concat(b);
          });
          _updateAdminFriends(adminIdsFlat, user._id, function (error) {
            if(error) {
              return res.status(error.code).jsonp({message: error.message});
            }
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
                return res.jsonp({message: 'Profile deleted.'});
              });
            });
          });
        });
      }
    });
  });
};