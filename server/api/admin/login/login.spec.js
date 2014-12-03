'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var uuid = require('node-uuid');
var app = require('../../../app');
var adminSchema = require('../../../components/schema/admin');
var db = require('../../../components/database');
var admins = db.admin;
admins.initialize();
var utils = db.utils;
utils.initialize();

describe('POST /api/admin/login', function() {

  beforeEach(function (done) {
    var adminId = uuid.v4();
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

  it('should successfully log the admin in', function(done) {
    request(app)
    .post('/api/admin/login')
    .send({
      username: 'mockadmin',
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
      done();
    });
  });

  it('should fail on an missing username', function(done) {
    request(app)
    .post('/api/admin/login')
    .send({
      password: 'mockpassword'
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

  it('should fail on an missing password', function(done) {
    request(app)
    .post('/api/admin/login')
    .send({
      username: 'mockadmin'
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

  it('should fail on an invalid username', function(done) {
    request(app)
    .post('/api/admin/login')
    .send({
      username: 'invalidusername',
      password: 'mockpassword'
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

  it('should fail on an invalid password', function(done) {
    request(app)
    .post('/api/admin/login')
    .send({
      username: 'mockadmin',
      password: 'invalidpassword'
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

  it('should fail on an unactivated account', function(done) {
    admins.searchByUsername('mockadmin', function (error, reply) {
      if(error) {
        return done(error);
      }
      var admin = reply.rows[0].value;
      admin.active = false;
      utils.insert(utils.admins, admin._id, admin, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/admin/login')
        .send({
          username: 'mockadmin',
          password: 'mockpassword'
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
  });
});
