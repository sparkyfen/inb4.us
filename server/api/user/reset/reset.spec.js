'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');
var app = require('../../../app');
var db = require('../../../components/database');
var userSchema = require('../../../components/schema/user');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

var userId;
var resetToken = uuid.v4();

describe('POST /api/user/reset', function() {

  beforeEach(function (done) {
    userId = uuid.v4();
    userSchema._id = userId;
    userSchema.tokens.activate = null;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.active = true;
    userSchema.tokens.reset = resetToken;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      done();
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

  it('should reset the user password', function(done) {
    request(app)
    .post('/api/user/reset')
    .send({
      id: userId,
      token: resetToken,
      new: 'newmockpassword',
      confirm: 'newmockpassword'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail on missing user id', function(done) {
    request(app)
    .post('/api/user/reset')
    .send({
      id: userId,
      token: resetToken,
      new: 'newmockpassword',
      confirm: 'newmockpassword'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail on missing user id', function(done) {
    request(app)
    .post('/api/user/reset')
    .send({
      token: resetToken,
      new: 'newmockpassword',
      confirm: 'newmockpassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail on missing reset token', function(done) {
    request(app)
    .post('/api/user/reset')
    .send({
      id: userId,
      new: 'newmockpassword',
      confirm: 'newmockpassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail on missing new password', function(done) {
    request(app)
    .post('/api/user/reset')
    .send({
      id: userId,
      token: resetToken,
      confirm: 'newmockpassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail on missing confirm password', function(done) {
    request(app)
    .post('/api/user/reset')
    .send({
      id: userId,
      token: resetToken,
      new: 'newmockpassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail on a short password', function(done) {
    request(app)
    .post('/api/user/reset')
    .send({
      id: userId,
      token: resetToken,
      new: 'short',
      confirm: 'short'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail when user does not exist', function(done) {
    request(app)
    .post('/api/user/reset')
    .send({
      id: uuid.v4(),
      token: resetToken,
      new: 'newmockpassword',
      confirm: 'newmockpassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should fail when reset token is not set', function(done) {
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.tokens.reset = null;
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/user/reset')
        .send({
          id: userId,
          token: uuid.v4(),
          new: 'newmockpassword',
          confirm: 'newmockpassword'
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log(res.body);
            return done(err);
          }
          res.body.should.be.instanceof(Object);
          res.body.should.have.property('message');
          done();
        });
      });
    });
  });

  it('should fail when reset token does not match user', function(done) {
    request(app)
    .post('/api/user/reset')
    .send({
      id: userId,
      token: uuid.v4(),
      new: 'newmockpassword',
      confirm: 'newmockpassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        console.log(res.body);
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });
});