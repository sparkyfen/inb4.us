'use strict';

var db = require('../../../components/database');
var users = db.user;
users.initialize();

// Deletes an account.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  users.deleteByUsername(username, function (error) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not delete user profile.'});
    }
    return res.jsonp({message: 'Profile deleted.'});
  });
};