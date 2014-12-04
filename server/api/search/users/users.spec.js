'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');
var app = require('../../../app');
var db = require('../../../components/database');
var userSchema = require('../../../components/schema/user');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

var userId

describe('GET /api/search/users/', function() {
  beforeEach(function (done) {
    userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.active = true;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      done();
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

  it('should successfully search for a known username', function(done) {
    request(app)
    .get('/api/search/users/mockuser')
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

  it('should successfully search for a known id', function(done) {
    request(app)
    .get('/api/search/users/' + userId)
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

  it('should successfully search for no user matched', function(done) {
    request(app)
    .get('/api/search/users/winter')
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

  it('should successfully search for more than one user', function(done) {
    userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mocktestuser';
    userSchema.email = 'mocktestuser@inb4.us';
    userSchema.active = true;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .get('/api/search/users/mock')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
        res.body.should.have.property('results');
        res.body.results.should.have.length(2);
        done();
      });
    });
  });

  it('should fail if missing the username and the id', function(done) {
    request(app)
    .get('/api/search/users/')
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

  it('should fail if the id is invalid', function(done) {
    request(app)
    .get('/api/search/users')
    .send({
      id: 'foobar'
    })
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