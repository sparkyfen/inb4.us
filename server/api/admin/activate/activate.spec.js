'use strict';

var should = require('should');
var app = require('../../../app');
var request = require('supertest');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var adminSchema = require('../../../components/schema/admin');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var admins = db.admin;
admins.initialize();
var adminId, token;

describe('POST /api/admin/activate', function() {

  beforeEach(function (done) {
    adminId = uuid.v4();
    adminSchema._id = adminId;
    adminSchema.password = bcrypt.hashSync('mockpassword', 10);
    adminSchema.username = 'mockadmin';
    adminSchema.email = 'mockadmin@inb4.us';
    adminSchema.tokens.activate = uuid.v4();
    token = adminSchema.tokens.activate;
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

  it('should successfully activate the admin account', function(done) {
    request(app)
    .post('/api/admin/activate')
    .send({
      id: adminId,
      token: token
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

  it('should fail when the id is missing', function(done) {
    request(app)
    .post('/api/admin/activate')
    .send({
      token: token
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

  it('should fail when the token is missing', function(done) {
    request(app)
    .post('/api/admin/activate')
    .send({
      id: adminId
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

  it('should fail when the id is invalid', function(done) {
    request(app)
    .post('/api/admin/activate')
    .send({
      id: 'foobar',
      token: token
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

  it('should fail when the token is invalid', function(done) {
    request(app)
    .post('/api/admin/activate')
    .send({
      id: adminId,
      token: 'foobar'
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