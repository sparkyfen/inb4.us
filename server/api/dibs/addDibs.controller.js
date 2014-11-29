'use strict';

var validator = require('validator');
var uuid = require('node-uuid');
var dibSchema = require('../../components/schema/dib');
var db = require('../../components/database');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();
var utils = db.utils;
utils.initialize();

function _validateRequest(name, description, type, callback) {
  if(validator.isNull(name)) {
    return callback('Missing name.');
  }
  if(validator.isNull(description)) {
    return callback('Missing description.');
  }
  if(validator.isNull(type)) {
    return callback('Missing type.');
  }
  if(!validator.isType(type)) {
    return callback('Invalid type.');
  }
  return callback();
}

// Add a dib to the database.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  var name = req.body.name;
  var description = req.body.description;
  var type = req.body.type;
  // TODO If we want someone to add more data in this request, we can offer it and update this to include that data.
  _validateRequest(name, description, type, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    type = type.toLowerCase();
    dibs.searchByName(name, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not add new dibs.'});
      }
      if(reply.rows.length !== 0) {
        for (var i = 0; i < reply.rows.length; i++) {
          if(reply.rows[i].value.type === type) {
            return res.status(400).jsonp({message: 'This item already exists'});
          }
        }
      }
      users.searchByUsername(username, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not add new dibs.'});
        }
        if(reply.rows.length === 0) {
          return res.status(400).jsonp({message: 'User does not exist.'});
        }
        var user = reply.rows[0].value;
        if(!user.active) {
          return res.status(400).jsonp({message: 'You must activate this account before using it.'});
        }
        // New item to add to the database
        dibSchema._id = uuid.v4();
        dibSchema.name = name;
        dibSchema.description = description;
        dibSchema.type = type;
        dibSchema.creator = user._id;
        dibSchema.dates.created = Date.now(Date.UTC());
        utils.insert(utils.dibs, dibSchema._id, dibSchema, function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not add new dibs.'});
          }
          return res.jsonp({message: 'Dib called!'});
        });
      });
    });
  });
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