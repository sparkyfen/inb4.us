'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('POST /api/email', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .post('/api/email')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        done();
      });
  });
});