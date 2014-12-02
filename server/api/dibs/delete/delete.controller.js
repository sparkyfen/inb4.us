'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();
var utils = db.utils;
utils.initialize();

// Validates name/type pair.
function _validateNameType(name, type, callback) {
  if(validator.isNull(name)) {
    return callback('Missing name.');
  }
  if(validator.isNull(type)) {
    return callback('Missing type.');
  }
  if(!validator.isType(type)) {
    return callback('Invalid type.');
  }
  return callback();
}

// Delete dib from database.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  var id = req.body.id;
  if(validator.isNull(id)) {
    var name = req.body.name;
    var type = req.body.type;
    _validateNameType(name, type, function (error) {
      if(error) {
        return res.status(400).jsonp({message: error});
      }
      users.searchByUsername(username, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not delete dib.'});
        }
        if(reply.rows.length === 0) {
          return res.status(400).jsonp({message: 'User does not exist.'});
        }
        var user = reply.rows[0].value;
        if(!user.active) {
          return res.status(400).jsonp({message: 'You must activate this account before using it.'});
        }
        if(user.dibs.length === 0) {
          return res.status(400).jsonp({message: 'User has no dibs.'});
        }
        dibs.searchByName(name, function (error, reply) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not delete dib.'});
          }
          if(reply.rows.length === 0) {
            return res.status(400).jsonp({message: 'Dib does not exist.'});
          }
          var dib = null;
          for (var i = 0; i < reply.rows.length; i++) {
            if(reply.rows[i].value.type === type) {
              dib = reply.rows[i].value;
            }
          }
          if(!dib) {
            return res.status(400).jsonp({message: 'Dib does not exist with requested type.'});
          }
          var dibIdIndex = user.dibs.indexOf(dib._id);
          if(dibIdIndex === -1) {
            return res.status(400).jsonp({message: 'No dib with that id is found for user.'});
          }
          var dibId =  user.dibs.splice(dibIdIndex, 1);
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
    });
  } else {
    if(!validator.isUUID(id)) {
      return res.status(400).jsonp({message: 'Invalid id.'});
    }
    users.searchByUsername(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not delete dib.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      var user = reply.rows[0].value;
      if(!user.active) {
        return res.status(400).jsonp({message: 'You must activate this account before using it.'});
      }
      if(user.dibs.length === 0) {
        return res.status(400).jsonp({message: 'User has no dibs.'});
      }
      var dibIdIndex = user.dibs.indexOf(id);
      if(dibIdIndex === -1) {
        return res.status(400).jsonp({message: 'No dib with that id is found for user.'});
      }
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
  }
};

validator.extend('isType', function (str) {
  switch(str.toLowerCase()) {
    case 'person':
    case 'place':
    case 'thing':
    return true;
    default:
    return false;
  }
});
