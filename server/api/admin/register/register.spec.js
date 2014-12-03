'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var uuid = require('node-uuid');
var app = require('../../../app');
var userSchema = require('../../../components/schema/user');
var adminSchema = require('../../../components/schema/admin');
var config = require('../../../config/environment');
var db = require('../../../components/database');
var utils = db.utils;
utils.initialize();
var admins = db.admin;
admins.initialize();
var users = db.user;
users.initialize();

var cookie;

describe('POST /api/admin/register', function() {

  beforeEach(function (done) {
    // Create an admin account and sign them in.
    // Only admins can create admin accounts.
    adminSchema._id = uuid.v4();
    adminSchema.username = config.admin.username,
    adminSchema.password = bcrypt.hashSync(config.admin.password, 10);
    adminSchema.email = config.admin.email;
    adminSchema.firstname = 'Admin';
    adminSchema.lastname = 'Admin';
    adminSchema.active = true;
    utils.insert(utils.admins, adminSchema._id, adminSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/admin/login')
      .send({
        username: config.admin.username,
        password: config.admin.password
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
      });
    });
  });

  it('should successfully register an admin', function(done) {
    request(app)
    .post('/api/admin/register')
    .set('cookie', cookie)
    .send({
      username: 'mockadmin',
      password: 'mockpassword',
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

  it('should fail when an admin is not signed in', function(done) {
    request(app)
    .post('/api/admin/register')
    .send({
      username: 'mockadmin',
      password: 'mockpassword',
      email: 'mockadmin@inb4.us'
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

  it('should fail on missing username', function(done) {
    request(app)
    .post('/api/admin/register')
    .set('cookie', cookie)
    .send({
      password: 'mockpassword',
      email: 'mockadmin@inb4.us'
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
    .post('/api/admin/register')
    .set('cookie', cookie)
    .send({
      username: 'mockadmin',
      email: 'mockadmin@inb4.us'
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
    .post('/api/admin/register')
    .set('cookie', cookie)
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

  it('should fail on invalid email', function(done) {
    request(app)
    .post('/api/admin/register')
    .set('cookie', cookie)
    .send({
      username: 'mockadmin',
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

  it('should fail on existing user email', function(done) {
    var userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'newmockadmin';
    userSchema.email = 'mockadmin@inb4.us';
    userSchema.tokens.activate = uuid.v4();
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/admin/register')
      .set('cookie', cookie)
      .send({
        username: 'mockadmin',
        password: 'mockpassword',
        email: 'mockadmin@inb4.us'
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

  it('should fail on existing admin email', function(done) {
    var adminId = uuid.v4();
    adminSchema._id = adminId;
    adminSchema.password = bcrypt.hashSync('mockpassword', 10);
    adminSchema.username = 'newmockadmin';
    adminSchema.email = 'mockadmin@inb4.us';
    adminSchema.tokens.activate = uuid.v4();
    utils.insert(utils.admins, adminId, adminSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/admin/register')
      .set('cookie', cookie)
      .send({
        username: 'mockadmin',
        password: 'mockpassword',
        email: 'mockadmin@inb4.us'
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

  it('should fail on existing user username', function(done) {
    var userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockadmin';
    userSchema.email = 'newmockadmin@inb4.us';
    userSchema.tokens.activate = uuid.v4();
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/admin/register')
      .set('cookie', cookie)
      .send({
        username: 'mockadmin',
        password: 'mockpassword',
        email: 'mockadmin@inb4.us'
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

  it('should fail on existing admin username', function(done) {
    var adminId = uuid.v4();
    adminSchema._id = adminId;
    adminSchema.password = bcrypt.hashSync('mockpassword', 10);
    adminSchema.username = 'mockadmin';
    adminSchema.email = 'newmockadmin@inb4.us';
    adminSchema.tokens.activate = uuid.v4();
    utils.insert(utils.admins, adminId, adminSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/admin/register')
      .set('cookie', cookie)
      .send({
        username: 'mockadmin',
        password: 'mockpassword',
        email: 'mockadmin@inb4.us'
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
