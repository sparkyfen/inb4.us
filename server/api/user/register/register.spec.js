'use strict';

var should = require('should');
var app = require('../../../app');
var users = require('../../../components/database/user');
users.initialize();
var request = require('supertest');

describe('POST /api/user/register', function() {

  beforeEach(function (done) {
    done();
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

  it('should successfully register a user', function(done) {
    request(app)
      .post('/api/user/register')
      .send({
        username: 'mockuser',
        password: 'mockpassword',
        email: 'mockemail@inb4.us'
      })
      .expect(200)
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