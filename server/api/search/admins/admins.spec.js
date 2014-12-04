'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');
var app = require('../../../app');
var db = require('../../../components/database');
var adminSchema = require('../../../components/schema/admin');
var admins = db.admin;
admins.initialize();
var utils = db.utils;
utils.initialize();

var adminId;

describe('GET /api/search/admins/', function() {
  beforeEach(function (done) {
    adminId = uuid.v4();
    adminSchema._id = adminId;
    adminSchema.password = bcrypt.hashSync('mockpassword', 10);
    adminSchema.username = 'mockadmin';
    adminSchema.email = 'mockadmin@inb4.us';
    adminSchema.active = true;
    utils.insert(utils.admins, adminId, adminSchema, function (error) {
      if(error) {
        return done(error);
      }
      done();
    });
  });

  afterEach(function (done) {
    admins.getAll(function (error, reply) {
      if(error) {
        return done(error);
      }
      var docs = reply.rows.map(function (row) {
        row.value._deleted = true;
        return row.value;
      });
      admins.bulk(docs, function (error) {
        if(error) {
          return done(error);
        }
        admins.compact(function (error) {
          if(error) {
            return done(error);
          }
          done();
        });
      });
    });
  });

  it('should successfully search for a known username', function(done) {
    request(app)
    .get('/api/search/admins/mockadmin')
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

  it('should successfully search for a known id', function(done) {
    request(app)
    .get('/api/search/admins/' + adminId)
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

  it('should successfully search for no admin matched', function(done) {
    request(app)
    .get('/api/search/admins/winter')
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

  it('should successfully search for more than one user', function(done) {
    adminId = uuid.v4();
    adminSchema._id = adminId;
    adminSchema.password = bcrypt.hashSync('mockpassword', 10);
    adminSchema.username = 'mocktestadmin';
    adminSchema.email = 'mocktestadmin@inb4.us';
    adminSchema.active = true;
    utils.insert(utils.admins, adminId, adminSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .get('/api/search/admins/mock')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
        res.body.should.have.property('results');
        res.body.results.should.have.length(2);
        done();
      });
    });
  });

  it('should fail if missing the username and the id', function(done) {
    request(app)
    .get('/api/search/admins/')
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

  it('should fail if the id is invalid', function(done) {
    request(app)
    .get('/api/search/admins')
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