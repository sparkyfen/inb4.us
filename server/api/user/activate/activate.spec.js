'use strict';

var should = require('should');
var app = require('../../../app');
var request = require('supertest');
var bcrypt = require('bcrypt');
var userSchema = require('../../../components/schema/user');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();
var userId, token;

describe('POST /api/user/activate', function() {

  beforeEach(function (done) {
    userId = userSchema.id;
    delete userSchema.id;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    token = userSchema.tokens.activate;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      userSchema.id = userId;
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

  it('should successfully activate an account', function(done) {
    request(app)
      .post('/api/user/activate')
      .send({
        id: userId,
        token: token
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
        done();
      });
  });
});