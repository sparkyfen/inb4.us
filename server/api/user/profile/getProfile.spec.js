'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var uuid = require('node-uuid');
var app = require('../../../app');
var db = require('../../../components/database');
var userSchema = require('../../../components/schema/user');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

var userId;
var cookie;

describe('GET /api/user', function() {

  beforeEach(function (done) {
    userId = uuid.v4();
    userSchema._id = userId;
    userSchema.tokens.activate = null;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.active = true;
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

  it('should successfully return the user logged in', function(done) {
    request(app)
    .get('/api/user')
    .set('cookie', cookie)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err)  {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      done();
    });
  });

  it('should successfully return the user based on their id', function(done) {
    request(app)
    .get('/api/user/' + userId)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err)  {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      done();
    });
  });

  it('should fail when missing an user id and no session', function(done) {
    request(app)
    .get('/api/user')
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err)  {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail when the user does not exist', function (done) {
    users.deleteByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .get('/api/user')
      .set('cookie', cookie)
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err)  {
          console.log(res.body);
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
        done();
      });
    });
  });

  it('should fail on an unactivated account', function(done) {
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.tokens.activate = uuid.v4();
      user.active = false;
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .get('/api/user')
        .set('cookie', cookie)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err)  {
            console.log(res.body);
            return done(err);
          }
          res.body.should.be.instanceof(Object);
          res.body.should.have.property('message');
          done();
        });
      });
    });
  });
});