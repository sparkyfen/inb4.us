'use strict';

var colors = require('colors');
var fs =  require('fs');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var config = require('./server/config/environment');
var db = require('./server/components/database');
var adminSchema = require('./server/components/schema/admin');
var user = db.user;
user.initialize();
var admin = db.admin;
admin.initialize();
var dibs = db.dib;
dibs.initialize();
var keywords = db.keyword;
keywords.initialize();
var utils = db.utils;
utils.initialize();

if(process.env.NODE_ENV === 'development') {
  if(!fs.existsSync('server/config/environment/development.js')) {
    fs.createReadStream('server/config/environment/development.js.template').pipe(fs.createWriteSteam('server/config/environment/development.js'));
    return console.log('Development config file created, please edit the variables in server/config/environment/development.js'.red);
  } else {
    console.log('Development config file exists, continuing...'.yellow);
  }
}

var userView = {views: {"all": {"map": "function(doc) {emit(null, doc)}","reduce": "_count"}, "by_username": {"map": "function(doc) {emit(doc.username, doc)}","reduce": "_count"}, "by_email": {"map": "function(doc) {emit(doc.email, doc)}","reduce": "_count"}, "by_id": {"map": "function(doc) {emit(doc._id, doc)}","reduce": "_count"}}};
var adminView = {views: {"all": {"map": "function(doc) {emit(null, doc)}","reduce": "_count"}, "by_username": {"map": "function(doc) {emit(doc.username, doc)}","reduce": "_count"}, "by_email": {"map": "function(doc) {emit(doc.email, doc)}","reduce": "_count"}, "by_id": {"map": "function(doc) {emit(doc._id, doc)}","reduce": "_count"}}};
var dibView = {views: {"all": {"map": "function(doc) {emit(null, doc)}","reduce": "_count"}, "by_name": {"map": "function(doc) {emit(doc.name, doc)}","reduce": "_count"}, "by_id": {"map": "function(doc) {emit(doc._id, doc)}","reduce": "_count"}, "by_creator": {"map": "function(doc) {emit(doc.creator, doc)}", "reduce": "_count"}, "by_date_created": {"map": "function(doc) {emit(doc.dates.created, doc)}", "reduce": "_count"}, "by_reported": {"map": "function(doc) {emit(doc.report.reported, doc)}", "reduce": "_count"}}};
var keywordsView = {views: {"all": {"map": "function(doc) {emit(null, doc)}", "reduce": "_count"}, "by_name": {"map": "function(doc) {emit(doc.name, doc)}", "reduce": "_count"}, "by_id": {"map": "function(doc) {emit(doc._id, doc)}","reduce": "_count"}}};

utils.create(config.couchdb.users, function (err) {
  if(err && err.statusCode !== 412) {
    console.log('Error creating users database.'.red);
    return console.log(err);
  }
  utils.insert(user.users, '_design/users', userView, function (err) {
    // 409 is Document update conflict.
    if(err && err.statusCode !== 409) {
      console.log('Error inserting user view.'.red);
      return console.log(err);
    }
    utils.create(config.couchdb.admins, function (err) {
      if(err && err.statusCode !== 412) {
        console.log('Error creating admins database.'.red);
        return console.log(err);
      }
      utils.insert(admin.admins, '_design/admins', adminView, function (err) {
        // 409 is Document update conflict.
        if(err && err.statusCode !== 409) {
          console.log('Error inserting admins view.'.red);
          return console.log(err);
        }
        adminSchema._id = uuid.v4();
        adminSchema.username = config.admin.username,
        adminSchema.password = bcrypt.hashSync(config.admin.password, 10);
        adminSchema.email = config.admin.email;
        adminSchema.firstname = 'Admin';
        adminSchema.lastname = 'Admin';
        adminSchema.active = true;
        utils.insert(utils.admins, adminSchema._id, adminSchema, function (err) {
          // 409 is Document update conflict.
          if(err && err.statusCode !== 409) {
            console.log('Error inserting admins view.'.red);
            return console.log(err);
          }
          utils.create(config.couchdb.dibs, function (err) {
            if(err && err.statusCode !== 412) {
              console.log('Error creating dibs database.'.red);
              return console.log(err);
            }
            utils.insert(dibs.dibs, '_design/dibs', dibView, function (err) {
              // 409 is Document update conflict.
              if(err && err.statusCode !== 409) {
                console.log('Error inserting dibs view.'.red);
                return console.log(err);
              }
              utils.create(config.couchdb.keywords, function (err) {
                if(err && err.statusCode !== 412) {
                  console.log('Error creating keywords database.'.red);
                  return console.log(err);
                }
                utils.insert(keywords.keywords, '_design/keywords', keywordsView, function (err) {
                  // 409 is Document update conflict.
                  if(err && err.statusCode !== 409) {
                    console.log('Error inserting dibs view.'.red);
                    return console.log(err);
                  }
                  console.log('DB Installation successful.'.green);
                });
              });
            });
          });
        });
      });
    });
  });
});