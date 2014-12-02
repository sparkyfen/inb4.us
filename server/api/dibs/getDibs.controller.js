'use strict';

var validator = require('validator');
var db = require('../../components/database');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();
var keywordsDB = db.keyword;
keywordsDB.initialize();
var utils = db.utils;
utils.initialize();

// Get a dib based on id or name
exports.index = function(req, res) {
  var id = req.param('id');
  if(validator.isNull(id)) {
    var type = req.param('type');
    var name = req.param('name');
    dibs.searchByName(name, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not get dib.'});
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
      if(!req.session.viewed) {
        req.session.viewed = {};
      }
      if(!req.session.viewed[dib._id]) {
        dib.viewers++;
        req.session.viewed[dib._id] = true;
      }
      utils.insert(utils.dibs, dib._id, dib, function (error) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not get dib.'});
        }
        users.searchById(dib.creator, function (error, reply) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not get dib.'});
          }
          if(reply.rows.length === 0) {
            return res.status(400).jsonp({message: 'User does not exist.'});
          }
          dib.creator = reply.rows[0].value.username;
          delete dib._rev;
          if(!dib.keywords) {
            return res.jsonp(dib);
          }
          keywordsDB.getMultipleIds(dib.keywords, function (error, reply) {
            if(error) {
              console.log(error);
              req.session.viewed[dib._id] = false;
              return res.status(500).jsonp({message: 'Could not get dib.'});
            }
            var dibNames = reply.rows.map(function (row) {
              return row.value.name;
            });
            dib.keywords = dibNames;
            return res.jsonp(dib);
          });
        });
      });
    });
  } else {
    dibs.searchById(id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not get dib.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Dib does not exist.'});
      }
      var dib = reply.rows[0].value;
      if(!req.session.viewed) {
        req.session.viewed = {};
      }
      if(!req.session.viewed[dib._id]) {
        dib.viewers++;
        req.session.viewed[dib._id] = true;
      }
      utils.insert(utils.dibs, dib._id, dib, function (error) {
        if(error) {
          console.log(error);
          req.session.viewed[dib._id] = false;
          return res.status(500).jsonp({message: 'Could not get dib.'});
        }
        users.searchById(dib.creator, function (error, reply) {
          if(error) {
            console.log(error);
            req.session.viewed[dib._id] = false;
            return res.status(500).jsonp({message: 'Could not get dib.'});
          }
          if(reply.rows.length === 0) {
            req.session.viewed[dib._id] = false;
            return res.status(400).jsonp({message: 'User does not exist.'});
          }
          dib.creator = reply.rows[0].value.username;
          delete dib._rev;
          if(!dib.keywords) {
            return res.jsonp(dib);
          }
          keywordsDB.getMultipleIds(dib.keywords, function (error, reply) {
            if(error) {
              console.log(error);
              req.session.viewed[dib._id] = false;
              return res.status(500).jsonp({message: 'Could not get dib.'});
            }
            var dibNames = reply.rows.map(function (row) {
              return row.value.name;
            });
            dib.keywords = dibNames;
            return res.jsonp(dib);
          });
        });
      });
    });
  }
};