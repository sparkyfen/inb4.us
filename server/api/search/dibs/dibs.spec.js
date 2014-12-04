'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');
var app = require('../../../app');
var db = require('../../../components/database');
var dibSchema = require('../../../components/schema/dib');
var dibs = db.dib;
dibs.initialize();
var utils = db.utils;
utils.initialize();

var dibId;

describe('GET /api/search/dibs', function() {

  beforeEach(function (done) {
    dibId = uuid.v4();
    dibSchema._id = dibId;
    dibSchema.name = 'mockuser';
    dibSchema.description = 'My Website!';
    dibSchema.type = 'thing';
    utils.insert(utils.dibs, dibId, dibSchema, function (error) {
      if(error) {
        return done(error);
      }
      done();
    });
  });

  afterEach(function (done) {
    dibs.getAll(function (error, reply) {
      if(error) {
        return done(error);
      }
      var docs = reply.rows.map(function (row) {
        row.value._deleted = true;
        return row.value;
      });
      dibs.bulk(docs, function (error) {
        if(error) {
          return done(error);
        }
        dibs.compact(function (error) {
          if(error) {
            return done(error);
          }
          done();
        });
      });
    });
  });

  it('should successfully search for a dib with a name and type', function(done) {
    request(app)
    .get('/api/search/dibs/thing/inb4.us')
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

  it('should successfully search for a dib with an id', function(done) {
    request(app)
    .get('/api/search/dibs/' + dibId)
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

  it('should successfully search for a dib with an id that does not exist', function(done) {
    request(app)
    .get('/api/search/dibs/' + uuid.v4())
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

  it('should successfully search for a dib with an name that does not exist', function(done) {
    request(app)
    .get('/api/search/dibs/')
    .send({
      name: 'foobar',
      type: 'person'
    })
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

  it('should if missing a name', function(done) {
    request(app)
    .get('/api/search/dibs/')
    .send({
      type: 'thing'
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

  it('should if missing a type', function(done) {
    request(app)
    .get('/api/search/dibs/')
    .send({
      name: 'inb4.us'
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

  it('should if using an invalid id', function(done) {
    request(app)
    .get('/api/search/dibs/')
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