'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');
var app = require('../../../app');
var config = require('../../../config/environment');
var userSchema = require('../../../components/schema/user');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

var dibId;
var cookie;

describe('POST /api/user/purge', function() {

  beforeEach(function (done) {
    var adminId = uuid.v4();
    userSchema._id = adminId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockadmin';
    userSchema.email = 'mockadmin@inb4.us';
    userSchema.active = true;
    userSchema.admin = true;
    userSchema.dates.created = Date.now(Date.UTC());
    userSchema.dates.activated = Date.now(Date.UTC());
    utils.insert(utils.users, adminId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/login')
      .send({
        username: 'mockadmin',
        password: 'mockpassword'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        cookie = res.headers['set-cookie'];
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
        done();
      });
    });
  });

  afterEach(function (done) {
    users.getAll(function (error, reply) {
      if(error) {
        return done(error);
      }
      var docs = reply.rows.map(function (row) {
        row.value._deleted = true;
        return row.value;
      });
      users.bulk(docs, function (error) {
        if(error) {
          return done(error);
        }
        users.compact(function (error) {
          if(error) {
            return done(error);
          }
          done();
        });
      });
    });
  });

  it('should successfully purge any inactive accounts older than 24 hours', function(done) {
    var userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.tokens.activate = uuid.v4();
    userSchema.dates.created = Date.now(Date.UTC()) - config.dates.purgeTime;
    userSchema.dates.activated = null;
    userSchema.active = false;
    userSchema.admin = false;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/purge')
      .set('cookie', cookie)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
        res.body.should.have.property('results');
        res.body.results.should.have.length(1);
        done();
      });
    });
  });

it('should successfully no purge any accounts', function(done) {
    request(app)
    .post('/api/user/purge')
    .set('cookie', cookie)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      res.body.should.have.property('results');
      res.body.results.should.have.length(0);
      done();
    });
  });

it('should successfully not purge accounts younger than 24 hours', function(done) {
    var userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.tokens.activate = uuid.v4();
    userSchema.dates.created = Date.now(Date.UTC());
    userSchema.dates.activated = null;
    userSchema.active = false;
    userSchema.admin = false;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/purge')
      .set('cookie', cookie)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
        res.body.should.have.property('results');
        res.body.results.should.have.length(0);
        done();
      });
    });
  });

  it('should fail if the admin is not signed in', function(done) {
    request(app)
    .post('/api/user/purge')
    .expect(401)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail if a user is signed in instead of an admin', function(done) {
    var userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.tokens.activate = null;
    userSchema.dates.created = Date.now(Date.UTC());
    userSchema.dates.activated = Date.now(Date.UTC());
    userSchema.active = true;
    userSchema.admin = false;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/login')
      .send({
        username: 'mockuser',
        password: 'mockpassword'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        cookie = res.headers['set-cookie'];
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
        request(app)
        .post('/api/user/purge')
        .set('cookie', cookie)
        .expect(401)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.be.instanceof(Object);
          res.body.should.have.property('message');
          done();
        });
      });
    });
  });

  it('should fail on an invalid datetime', function(done) {
    request(app)
    .post('/api/user/purge')
    .send({
      datetime: 'foobar'
    })
    .set('cookie', cookie)
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });
});