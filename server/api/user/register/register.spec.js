'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var app = require('../../../app');
var userSchema = require('../../../components/schema/user');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var users = db.user;
users.initialize();

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

  it('should fail on missing username', function(done) {
    request(app)
    .post('/api/user/register')
    .send({
      password: 'mockpassword',
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

  it('should fail on missing password', function(done) {
    request(app)
    .post('/api/user/register')
    .send({
      username: 'mockuser',
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

  it('should fail on missing email', function(done) {
    request(app)
    .post('/api/user/register')
    .send({
      username: 'mockuser',
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

  it('should fail on invalid email', function(done) {
    request(app)
    .post('/api/user/register')
    .send({
      username: 'mockuser',
      password: 'mockpassword',
      email: 'invalidemail'
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

  it('should fail on existing email', function(done) {
    var userId = userSchema.id;
    delete userSchema.id;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'newmockuser';
    userSchema.email = 'mockuser@inb4.us';
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      userSchema.id = userId;
      request(app)
      .post('/api/user/register')
      .send({
        username: 'mockuser',
        password: 'mockpassword',
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

  it('should fail on existing username', function(done) {
    var userId = userSchema.id;
    delete userSchema.id;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'newmockuser@inb4.us';
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      userSchema.id = userId;
      request(app)
      .post('/api/user/register')
      .send({
        username: 'mockuser',
        password: 'mockpassword',
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
