'use strict';

var should = require('should');
var request = require('supertest');
var app = require('../../../app');

describe('POST /api/user', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .post('/api/user')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});