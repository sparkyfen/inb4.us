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
       if(type === 'all') {
         var dibItems = reply.rows.map(function (row) {
           return {id: row.value._id, url: '/beta/dibs/' + row.value._id, title: row.value.name, description: row.value.description};
         });
       } else {
         var dibItems = [];
         for (var i = 0; i < reply.rows.length; i++) {
           var dib = reply.rows[i].value;
           if(dib.type === type) {
             dibItems.push({id: dib._id, url: '/beta/dibs/' + dib._id, title: dib.name, description: dib.description});
           }
         }
       }
       if(dibItems.length === 0) {
         return res.jsonp({message: 'No results.', results: []});
       }
       return res.jsonp({message: 'Results found.', results: dibItems, action: {url: '/beta/add',text: 'Call dibs!'}});
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
      var dibItems = reply.rows.map(function (row) {
        return {id: row.value._id, url: '/beta/dibs/' + row.value._id, title: row.value.name, description: row.value.description};
      });
      return res.jsonp({message: 'Results found.', results: dibItems, action: {url: '/beta/add',text: 'Call dibs!'}});
    });
  }
};

validator.extend('isType', function (str) {
  switch(str.toLowerCase()) {
    case 'person':
    case 'place':
    case 'thing':
    case 'all':
    return true;
    default:
    return false;
  }
});