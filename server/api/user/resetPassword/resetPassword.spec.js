'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var app = require('../../../app');
var userSchema = require('../../../components/schema/user');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

var cookie;

describe('POST /api/user/reset', function() {

  beforeEach(function (done) {
    var userId = userSchema.id;
    delete userSchema.id;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.active = true;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/login')
      .send({
        username: 'mockuser',
        password: 'mockpassword'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        cookie = res.headers['set-cookie'];
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message');
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

  it('should successfully reset the user\'s password', function(done) {
    request(app)
      .post('/api/user/reset')
      .send({
        old: 'mockpassword',
        new: 'newmockpassword',
        confirm: 'newmockpassword'
      })
      .set('cookie', cookie)
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

  it('should fail when missing the session', function(done) {
    request(app)
      .post('/api/user/reset')
      .send({
        old: 'mockpassword',
        new: 'newmockpassword',
        confirm: 'newmockpassword'
      })
      .expect(401)
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

  it('should fail when missing the old password', function(done) {
    request(app)
      .post('/api/user/reset')
      .send({
        new: 'newmockpassword',
        confirm: 'newmockpassword'
      })
      .set('cookie', cookie)
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

  it('should fail when missing the new password', function(done) {
    request(app)
      .post('/api/user/reset')
      .send({
        old: 'mockpassword',
        confirm: 'newmockpassword'
      })
      .set('cookie', cookie)
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

  it('should fail when missing the new confirm password', function(done) {
    request(app)
      .post('/api/user/reset')
      .send({
        old: 'mockpassword',
        new: 'newmockpassword'
      })
      .set('cookie', cookie)
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

  it('should fail when the new passwords do not match', function(done) {
    request(app)
      .post('/api/user/reset')
      .send({
        old: 'mockpassword',
        new: 'newmockpassword',
        confirm: 'newfailmockpassword'
      })
      .set('cookie', cookie)
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
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.active = false;
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/user/reset')
        .send({
          old: 'mockpassword',
          new: 'newmockpassword',
          confirm: 'newmockpassword'
        })
        .set('cookie', cookie)
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

  it('should fail when the user does not exist', function (done) {
    users.deleteByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/reset')
      .send({
        old: 'mockpassword',
        new: 'newmockpassword',
        confirm: 'newmockpassword'
      })
      .set('cookie', cookie)
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