'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var app = require('../../../app');
var db = require('../../../components/database');
var userSchema = require('../../../components/schema/user');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

var cookie;

describe('POST /api/user/delete', function() {

  beforeEach(function (done) {
    var userId = userSchema.id;
    delete userSchema.id;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.active = true;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      userSchema.id = userId;
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

  it('should successfully delete the user profile', function(done) {
    request(app)
    .post('/api/user/delete')
    .set('cookie', cookie)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err)  {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail when user is not logged in', function(done) {
    request(app)
    .post('/api/user/delete')
    .expect(401)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err)  {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });
});