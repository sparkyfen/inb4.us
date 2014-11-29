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

var userId;
var resetToken = uuid.v4();

describe('POST /api/user/reset', function() {

  beforeEach(function (done) {
    userId = userSchema.id;
    delete userSchema.id;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.active = true;
    userSchema.tokens.reset = resetToken;
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

  it('should respond with JSON array', function(done) {
    // TODO Fix this reset test.
    request(app)
      .post('/api/user/reset')
      .send({
        id: userId,
        token: resetToken,
        new: 'newmockpassword',
        confirm: 'newmockpassword'
      })
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          console.log(res.body);
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
        done();
      });
  });
});