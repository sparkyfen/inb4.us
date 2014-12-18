'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var uuid = require('node-uuid');
var app = require('../../../app');
var userSchema = require('../../../components/schema/user');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

describe('POST /api/user/resend', function() {

  beforeEach(function (done) {
    var userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.tokens.activate = uuid.v4();
    userSchema.active = false;
    userSchema.admin = false;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      var userId = uuid.v4();
      userSchema._id = userId;
      userSchema.password = bcrypt.hashSync('mockpassword', 10);
      userSchema.username = 'mockadmin';
      userSchema.email = 'mockadmin@inb4.us';
      userSchema.tokens.activate = uuid.v4();
      userSchema.active = false;
      userSchema.admin = true;
      utils.insert(utils.users, userId, userSchema, function (error) {
        if(error) {
          return done(error);
        }
        done();
      });
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

  it('should successfully resend the activation email', function(done) {
    request(app)
    .post('/api/user/resend')
    .send({
      email: 'mockuser@inb4.us'
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

  it('should successfully resend the admin activation email', function(done) {
    request(app)
    .post('/api/user/resend')
    .send({
      email: 'mockadmin@inb4.us'
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

  it('should fail on missing email', function(done) {
    request(app)
    .post('/api/user/resend')
    .send({
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

  it('should fail on invalid email', function(done) {
    request(app)
    .post('/api/user/resend')
    .send({
      email: 'foobar'
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

  it('should fail on already activated account', function(done) {
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.tokens.activate = null;
      user.active = true;
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/user/resend')
        .send({
          email: 'mockuser@inb4.us'
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

  it('should fail if the account is locked', function(done) {
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.locked = true;
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/user/resend')
        .send({
          email: 'mockuser@inb4.us'
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