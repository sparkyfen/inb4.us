'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var dibs = db.dib;
dibs.initialize();

function _validateNameType(name, type, callback) {
  if(validator.isNull(type)) {
    return callback('Missing type.');
  }
  if(!validator.isType(type)) {
    return callback('Invalid type.');
  }
  if(validator.isNull(name)) {
    return callback('Missing name.');
  }
  return callback();
}

// Search for dibs.
exports.index = function(req, res) {
  var id = req.param('id');
  if(validator.isNull(id)) {
    var name = req.param('name');
    var type = req.param('type');
   _validateNameType(name, type, function (error) {
     if(error) {
       return res.status(400).jsonp({message: error});
     }
     type = type.toLowerCase();
     dibs.searchPartialName(name, function (error, reply) {
       if(error) {
         console.log(error);
         return res.status(500).jsonp({message: 'Could not search for dibs.'});
       }
       if(reply.rows.length === 0) {
         return res.jsonp({message: 'No results.', results: []});
       }
       var dibNames = [];
       for (var i = 0; i < reply.rows.length; i++) {
         var dib = reply.rows[i].value;
         if(dib.type === type) {
           dibNames.push(dib.name);
         }
       }
       if(dibNames.length === 0) {
         return res.jsonp({message: 'No results.', results: []});
       }
       return res.jsonp({message: 'Results found.', results: dibNames});
     });
   });
  } else {
    if(!validator.isUUID(id)) {
      return res.status(400).jsonp({message: 'Invalid id.'});
    }
    dibs.searchById(id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not search for dibs.'});
      }
      if(reply.rows.length === 0) {
        return res.jsonp({message: 'No results.', results: []});
      }
      var dibNames = reply.rows.map(function (row) {
        return row.value.name;
      });
      return res.jsonp({message: 'Results found.', results: dibNames});
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