'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var users = db.user;
users.initialize();

// Search for a user in the database.
exports.index = function(req, res) {
  var id = req.param('id');
  if(validator.isNull(id)) {
    var username = req.param('username');
    if(validator.isNull(username)) {
      return res.status(400).jsonp({message: 'Missing id or name.'});
    }
    // We cannot put a username length requirement because when registering, we don't have that contraint implemented.
    users.searchPartialUsername(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not search for user.'});
      }
      if(reply.rows.length === 0) {
        return res.jsonp({message: 'No results.', results: []});
      }
      var usernames = reply.rows.map(function (row) {
        return row.value.username;
      });
      // TODO If we want more data on the users, we can update the usernames list with these values.
      return res.jsonp({message: 'Results found.', results: usernames});
    });
  } else {
    if(!validator.isUUID(id)) {
      return res.status(400).jsonp({message: 'Invalid id.'});
    }
    users.searchById(id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not search for user.'});
      }
      if(reply.rows.length === 0) {
        return res.jsonp({message: 'No results.', results: []});
      }
      var usernames = reply.rows.map(function (row) {
        return row.value.usersname;
      });
      // TODO If we want more data on the users, we can update the usernames list with these values.
      return res.jsonp({message: 'Results found.', results: usernames});
    });
  }
};