'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var app = require('../../../app');
var userSchema = require('../../../components/schema/user');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

describe('GET /api/user/logout', function() {

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

  it('should successfully log the user out', function(done) {
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
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      request(app)
      .get('/api/user/logout')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
    });
  });
});