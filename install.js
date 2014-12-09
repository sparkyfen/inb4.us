'use strict';

var colors = require('colors');
var fs =  require('fs');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var config = require('./server/config/environment');
var userSchema = require('./server/components/schema/user');
var db = require('./server/components/database');
var user = db.user;
user.initialize();
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

var userView = require('./server/components/views/user');
var dibView = require('./server/components/views/dib');
var keywordsView = require('./server/components/views/keyword');

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
    userSchema._id = uuid.v4();
    userSchema.username = config.admin.username,
    userSchema.password = bcrypt.hashSync(config.admin.password, 10);
    userSchema.email = config.admin.email;
    userSchema.firstname = 'Admin';
    userSchema.lastname = 'Admin';
    userSchema.active = true;
    userSchema.admin = true;
    utils.insert(utils.users, userSchema._id, userSchema, function (err) {
      // 409 is Document update conflict.
      if(err && err.statusCode !== 409) {
        console.log('Error inserting new admin.'.red);
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