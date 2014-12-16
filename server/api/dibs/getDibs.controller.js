'use strict';

var validator = require('validator');
var _ = require('lodash');
var db = require('../../components/database');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();
var keywordsDB = db.keyword;
keywordsDB.initialize();
var utils = db.utils;
utils.initialize();

function _validateRequest(id, callback) {
  if(validator.isNull(id)) {
    return callback('Missing id.');
  }
  if(!validator.isUUID(id)) {
    return callback('Invalid id.');
  }
  return callback();
}

function _getDibReports(reports, callback) {
  var reporterIds = reports.map(function (report) {
    return report.reporter;
  });
  users.getMultipleIds(reporterIds, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not get dib.'});
    }
    if(reply.rows.length === 0) {
      return callback({code: 400, message: 'No reporters exist.'});
    }
    if(reply.rows.length !== reports.length) {
      return callback({code: 400, message: 'One or more reporters do not exist.'});
    }
    var reporters = reply.rows.map(function (row) {
      return row.value.name;
    });
    var reports = reports.map(function (report, index) {
      report.reporter = reporters[index];
      return report;
    });
    return callback(null, reports);
  });
}

function _getKeywords(keywords, callback) {
  keywordsDB.getMultipleIds(keywords, function (error, reply) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not get dib.'});
    }
    var keywordNames = reply.rows.map(function (row) {
      return row.value.name;
    });
    return callback(null, keywordNames);
  });
}

// Get a dib based on id.
exports.index = function(req, res) {
  var id = req.param('id');
  // Validate input data
  _validateRequest(id, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Search for dib by id
    dibs.searchById(id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not get dib.'});
      }
      // No dib in databsae
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Dib does not exist.'});
      }
      // Get dib
      var dib = reply.rows[0].value;
      // Copy of dib
      var dibCopy = _.clone(dib);
      // Search for dib creator
      users.searchById(dib.creator, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not get dib.'});
        }
        if(reply.rows.length === 0) {
          return res.status(400).jsonp({message: 'User does not exist.'});
        }
        // Update dib creator for output
        dibCopy.creator = reply.rows[0].value.username;
        // if we have a report
        if(dib.reports.length > 0) {
          _getDibReports(dib.reports, function (error, reports) {
            if(error) {
              return res.status(error.code).jsonp({message: error.message});
            }
            dibCopy.reports = reports;
            // If we have keywords
            if(dib.keywords.length > 0) {
              _getKeywords(dib.keywords, function (error, keywords) {
                if(error) {
                  return res.status(error.code).jsonp({message: error.message});
                }
                dibCopy.keywords = keywords;
                // Update view count in database and add/edit session
                if(!req.session.viewed) {
                  req.session.viewed = {};
                }
                if(!req.session.viewed[dib._id]) {
                  dib.viewers++;
                  req.session.viewed[dib._id] = true;
                  utils.insert(utils.dibs, dib._id, dib, function (error) {
                    if(error) {
                      console.log(error);
                      req.session.viewed[dib._id] = false;
                      return res.status(500).jsonp({message: 'Could not get dib.'});
                    }
                    return res.jsonp(dibCopy);
                  });
                } else {
                  return res.jsonp(dibCopy);
                }
              });
            } else {
              // No keywords
              // Update view count in database and add/edit session
              if(!req.session.viewed) {
                req.session.viewed = {};
              }
              if(!req.session.viewed[dib._id]) {
                dib.viewers++;
                req.session.viewed[dib._id] = true;
                utils.insert(utils.dibs, dib._id, dib, function (error) {
                  if(error) {
                    console.log(error);
                    req.session.viewed[dib._id] = false;
                    return res.status(500).jsonp({message: 'Could not get dib.'});
                  }
                  delete dibCopy._rev;
                  return res.jsonp(dibCopy);
                });
              } else {
                delete dibCopy._rev;
                return res.jsonp(dibCopy);
              }
            }
          });
        } else if(dib.keywords.length > 0) {
          // We have keywords
          _getKeywords(dib.keywords, function (error, keywords) {
            if(error) {
              return res.status(error.code).jsonp({message: error.message});
            }
            dibCopy.keywords = keywords;
            // Update view count in database and add/edit session
            if(!req.session.viewed) {
              req.session.viewed = {};
            }
            if(!req.session.viewed[dib._id]) {
              dib.viewers++;
              req.session.viewed[dib._id] = true;
              utils.insert(utils.dibs, dib._id, dib, function (error) {
                if(error) {
                  console.log(error);
                  req.session.viewed[dib._id] = false;
                  return res.status(500).jsonp({message: 'Could not get dib.'});
                }
                delete dibCopy._rev;
                return res.jsonp(dibCopy);
              });
            } else {
              delete dibCopy._rev;
              return res.jsonp(dibCopy);
            }
          });
        } else {
          // No keywords or reports
          // Update view count in database and add/edit session
          if(!req.session.viewed) {
            req.session.viewed = {};
          }
          if(!req.session.viewed[dib._id]) {
            dib.viewers++;
            req.session.viewed[dib._id] = true;
            utils.insert(utils.dibs, dib._id, dib, function (error) {
              if(error) {
                console.log(error);
                req.session.viewed[dib._id] = false;
                return res.status(500).jsonp({message: 'Could not get dib.'});
              }
              delete dibCopy._rev;
              return res.jsonp(dibCopy);
            });
          } else {
            delete dibCopy._rev;
            return res.jsonp(dibCopy);
          }
        }
      });
    });
  });
};