'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');
var app = require('../../app');
var db = require('../../components/database');
var userSchema = require('../../components/schema/user');
var dibSchema = require('../../components/schema/dib');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();
var utils = db.utils;
utils.initialize();

var cookie;

describe('POST /api/dibs', function() {

  beforeEach(function (done) {
    var userId = uuid.v4();
    userSchema._id = userId;
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
      });
    });
  });

  it('should successfully add a new dib', function(done) {
    request(app)
    .post('/api/dibs')
    .send({
      name: 'inb4.us',
      description: 'My website!',
      type: 'thing'
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

  it('should fail when user is not logged in', function(done) {
    request(app)
    .post('/api/dibs')
    .send({
      name: 'inb4.us',
      description: 'My website!',
      type: 'thing'
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

  it('should fail due to missing dib name', function(done) {
    request(app)
    .post('/api/dibs')
    .send({
      description: 'My website!',
      type: 'thing'
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

  it('should fail due to missing dib description', function(done) {
    request(app)
    .post('/api/dibs')
    .send({
      name: 'inb4.us',
      type: 'thing'
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

  it('should fail due to missing dib type', function(done) {
    request(app)
    .post('/api/dibs')
    .send({
      name: 'inb4.us',
      description: 'My website!'
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

  it('should fail due to invalid dib type', function(done) {
    request(app)
    .post('/api/dibs')
    .send({
      name: 'inb4.us',
      description: 'My website!',
      type: 'sometype'
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

  it('should fail if a dib already exists with the same name and type', function(done) {
    dibSchema._id = uuid.v4();
    dibSchema.name = 'inb4.us';
    dibSchema.type = 'thing';
    utils.insert(utils.dibs, dibSchema._id, dibSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/dibs')
      .send({
        name: 'inb4.us',
        description: 'My website!',
        type: 'thing'
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

  it('should succeed if a dib already exists with the same name but a different type', function(done) {
    dibSchema._id = uuid.v4();
    dibSchema.name = 'inb4.us';
    dibSchema.type = 'place';
    utils.insert(utils.dibs, dibSchema._id, dibSchema, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/dibs')
      .send({
        name: 'inb4.us',
        description: 'My website!',
        type: 'thing'
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
  });

  it('should fail when the user does not exist', function (done) {
    users.deleteByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/dibs')
      .send({
        name: 'inb4.us',
        description: 'My website!',
        type: 'thing'
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

  it('should fail on an unactivated account', function(done) {
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.tokens.activate = uuid.v4();
      user.active = false;
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/dibs')
        .send({
          name: 'inb4.us',
          description: 'My website!',
          type: 'thing'
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
});