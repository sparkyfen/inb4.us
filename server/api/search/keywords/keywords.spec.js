'use strict';

var should = require('should');
var uuid = require('node-uuid');
var request = require('supertest');
var app = require('../../../app');
var db = require('../../../components/database');
var keywords = db.keyword;
keywords.initialize();
var utils = db.utils;
utils.initialize();

var keywordId;

describe('GET /api/search/keywords', function() {

  beforeEach(function (done) {
    keywordId = uuid.v4();
    var keyword = {
      _id: keywordId,
      name: 'mockkeyword'
    };
    utils.insert(utils.keywords, keyword._id, keyword, function (error) {
      if(error) {
        return done(error);
      }
      done();
    });
  });

  afterEach(function (done) {
    keywords.getAll(function (error, reply) {
      if(error) {
        return done(error);
      }
      var docs = reply.rows.map(function (row) {
        row.value._deleted = true;
        return row.value;
      });
      keywords.bulk(docs, function (error) {
        if(error) {
          return done(error);
        }
        keywords.compact(function (error) {
          if(error) {
            return done(error);
          }
          done();
        });
      });
    });
  });

  it('should successfully search for a keyword based on the name', function(done) {
    request(app)
    .get('/api/search/keywords/mockkeyword')
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

  it('should successfully search for a keyword based on the id', function(done) {
    request(app)
    .get('/api/search/keywords/' + keywordId)
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

  it('should successfully search for no results based on the name', function(done) {
    request(app)
    .get('/api/search/keywords/winter')
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

  it('should successfully search for no results based on the id', function(done) {
    request(app)
    .get('/api/search/keywords/' + uuid.v4())
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