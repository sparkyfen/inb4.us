'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var keywords = db.keyword;
keywords.initialize();

function _validateName(name, callback) {
  if(validator.isNull(name)) {
    return callback('Missing name.');
  }
  return callback();
}

// Search for keywords
exports.index = function(req, res) {
  var id = req.param('id');
  if(validator.isNull(id)) {
    var name = req.param('name');
    _validateName(name, function (error) {
      if(error) {
        return res.status(400).jsonp({message: error});
      }
      keywords.searchPartialName(name, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not search keywords.'});
        }
        if(reply.rows.length === 0) {
          return res.jsonp({message: 'No results.', results: []});
        }
        var keywordNames = reply.rows.map(function (row) {
          return {id: row.value._id, title: row.value.name};
        });
        return res.jsonp({message: 'Results found.', results: keywordNames});
      });
    });
  } else {
    if(!validator.isUUID(id)) {
      return res.status(400).jsonp({message: 'Invalid id.'});
    }
    keywords.searchById(id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not search keywords.'});
      }
      if(reply.rows.length === 0) {
        return res.jsonp({message: 'No results.', results: []});
      }
      var keywordNames = reply.rows.map(function (row) {
        return {id: row.value._id, title: row.value.name};
      });
      return res.jsonp({message: 'Results found.', results: keywordNames});
    });
  }
};