'use strict';

var validator = require('validator');
var uuid = require('node-uuid');
var _ = require('lodash');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();
var keywordsDB = db.keyword;
keywordsDB.initialize();
var utils = db.utils;
utils.initialize();

// TODO We can do some more validation on checking for "similar" keywords here, example: "foobar" and "FooBar" are similar.
// TODO Allow image links other than Imgur and upload them.

// Get keywords from database and add any new ones that are not there.
// Return the list of keywords, new and old.
function _checkAndAddKeywords(keywords, callback) {
  keywordsDB.getMultipleNames(keywords, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not edit dib.'});
    }
    var keywordIds = reply.rows.map(function (row) {
      return row.value._id;
    });
    var keywordsReply = reply.rows.map(function (row) {
      return row.value.name;
    });
    var missing = _.difference(keywords, keywordsReply);
    missing = missing.map(function (entry) {
      return {_id: uuid.v4(), name: entry};
    });
    var newKeywordIds = missing.map(function (entry) {
      return missing._id;
    })
    keywordIds = keywordIds.concat(newKeywordIds);
    if(missing.length === 0) {
      return callback(null, keywordIds);
    }
    keywordsDB.bulk(missing, function (error) {
      if(error) {
        console.log(error);
        return callback({code: 500, message: 'Could not edit dib.'});
      }
      return callback(null, keywordIds);
    });
  });
}

// Validates the incoming user input not including the id or name/type pair, thats done below.
function _validateRequest(params, callback) {
  if(!validator.isNull(params.image) && !validator.isURL(params.image)) {
    return callback({code: 400, message: 'Invalid image.'});
  }
  if(!validator.isNull(params.image) && !validator.contains(params.image, '://i.imgur.com/')) {
    return callback({code: 400, message: 'Image must be an Imgur link.'});
  }
  if(!validator.isNull(params.url) && !validator.isURL(params.url)) {
    return callback({code: 400, message: 'Invalid URL.'});
  }
  if(!validator.isNull(params.keywords) && !(params.keywords instanceof Array)) {
    return callback({code: 400, message: 'Keywords must be a list.'});
  }
  if(!validator.isNull(params.keywords)) {
    _checkAndAddKeywords(params.keywords, function (error, keywordIds) {
      if(error) {
        return callback(error);
      }
      return callback(null, keywordIds);
    });
  } else {
    return callback();
  }
}

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

// Gets the dib from the database, whether via id or from name/type pair.
function _searchForDib(reqType, params, callback) {
  if(reqType === 'name') {
    dibs.searchByName(params.name, function (error, reply) {
      if(error) {
        console.log(error);
        return callback({code: 500, message: 'Could not edit dib.'});
      }
      if(reply.rows.length === 0) {
        return callback({code: 400, message: 'Dib does not exist.'});
      }
      var dib = null;
      for (var i = 0; i < reply.rows.length; i++) {
        if(reply.rows[i].value.type === params.type) {
          dib = reply.rows[i].value;
        }
      }
      if(!dib) {
        return callback({code: 400, message: 'Dib does not exist with requested type.'});
      }
      if(!dib.active) {
        return callback({code: 400, message: 'Dib is not active, please reactivate it before editing.'});
      }
      return callback(null, dib);
    });
  } else {
    dibs.searchById(params.id, function (error, reply) {
      if(error) {
        console.log(error);
        return callback({code: 500, message: 'Could not edit dib.'});
      }
      if(reply.rows.length === 0) {
        return callback({code: 400, message: 'Dib does not exist.'});
      }
      var dib = reply.rows[0].value;
      if(!dib.active) {
        return callback({code: 400, message: 'Dib is not active, please reactivate it before editing.'});
      }
      return callback(null, dib);
    });
  }
}

// Validates whether the user can edit this dib.
function _validateUser(username, dib, callback) {
  users.searchById(dib.creator, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not edit dib.'});
    }
    if(reply.rows.length === 0) {
      return callback({code: 400, message: 'User does not exist.'});
    }
    var user = reply.rows[0].value;
    if(!user.active) {
      return callback({code: 400, message: 'You must activate this account before using it.'});
    }
    if(username !== user.username) {
      return callback({code: 400, message: 'User cannot edit this dib.'});
    }
    return callback();
  });
}

// Edit a dib
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  var image = req.body.image;
  var url = req.body.url;
  var description = req.body.description;
  var keywords = req.body.keywords;
  _validateRequest({image: image, url: url, keywords: keywords}, function (error, keywordIds) {
    if(error) {
      return res.status(error.code).jsonp({message: error.message});
    }
    var id = req.body.id;
    // We have a name/type pair
    if(validator.isNull(id)) {
      var name = req.body.name;
      var type = req.body.type;
      _validateNameType(name, type, function (error) {
        if(error) {
          return res.status(400).jsonp({message: error});
        }
        _searchForDib('name', {name: name, type: type}, function (error, dib) {
          if(error) {
            return res.status(error.code).jsonp({message: error.message});
          }
          _validateUser(username, dib, function (error) {
            if(error) {
              return res.status(error.code).jsonp({message: error.message});
            }
            var edited = false;
            if(!validator.isNull(url)) {
              dib.url = url;
              edited = true;
            }
            if(!validator.isNull(image)) {
              dib.image = image;
              edited = true;
            }
            if(keywordIds && keywordIds.length !== 0) {
              dib.keywords = keywordIds;
              edited = true;
            }
            if(!validator.isNull(description)) {
              dib.description = description;
              edited = true;
            }
            if(edited) {
              dib.dates.edited = Date.now(Date.UTC());
              utils.insert(utils.dibs, dib._id, dib, function (error) {
                if(error) {
                  console.log(error);
                  return res.status(500).jsonp({message: 'Could not edit dib.'});
                }
                return res.jsonp({message: 'Dib edited.'});
              });
            } else {
              return res.jsonp({message: 'Nothing to change for dib.'});
            }
          });
        });
      });
    } else {
      // We are using the id value.
      if(!validator.isUUID(id)) {
        return res.status(400).jsonp({message: 'Invalid id.'});
      }
      _searchForDib('id', {id: id}, function (error, dib) {
        if(error) {
          return res.status(error.code).jsonp({message: error.message});
        }
        _validateUser(username, dib, function (error) {
          if(error) {
            return res.status(error.code).jsonp({message: error.message});
          }
          var edited = false;
          if(!validator.isNull(url)) {
            dib.url = url;
            edited = true;
          }
          if(!validator.isNull(image)) {
            dib.image = image;
            edited = true;
          }
          if(keywordIds && keywordIds.length !== 0) {
            dib.keywords = keywordIds;
            edited = true;
          }
          if(!validator.isNull(description)) {
            dib.description = description;
            edited = true;
          }
          if(edited) {
            dib.dates.edited = Date.now(Date.UTC());
            utils.insert(utils.dibs, dib._id, dib, function (error) {
              if(error) {
                console.log(error);
                return res.status(500).jsonp({message: 'Could not edit dib.'});
              }
              return res.jsonp({message: 'Dib edited.'});
            });
          } else {
            return res.jsonp({message: 'Nothing to change for dib.'});
          }
        });
      });
    }
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