'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');
var app = require('../../../app');
var userSchema = require('../../../components/schema/user');
var dibSchema = require('../../../components/schema/dib');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var dibs = db.dib;
dibs.initialize();
var utils = db.utils;
utils.initialize();

var dibId;
var cookie;

describe('POST /api/dibs/delete', function() {

  beforeEach(function (done) {
    var userId = uuid.v4();
    dibId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.active = true;
    userSchema.dibs = [dibId];
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      dibSchema._id = dibId;
      dibSchema.name = 'inb4.us';
      dibSchema.type = 'thing';
      dibSchema.creator = userId;
      dibSchema.dates.created = Date.now(Date.UTC());
      utils.insert(utils.dibs, dibId, dibSchema, function (error) {
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

  it('should successfully delete a dib', function(done) {
    request(app)
    .post('/api/dibs/delete')
    .set('cookie', cookie)
    .send({
      id: dibId
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

  it('should fail when user is not logged in', function(done) {
    request(app)
    .post('/api/dibs/delete')
    .send({
      id: dibId
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

  it('should fail when the id is invalid', function(done) {
    request(app)
    .post('/api/dibs/delete')
    .set('cookie', cookie)
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

  it('should fail if the user does not exist', function(done) {
    users.deleteByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/dibs/delete')
      .set('cookie', cookie)
      .send({
        name: 'inb4.us',
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
  });

  it('should fail if the user has no dibs', function(done) {
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.dibs = [];
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/dibs/delete')
        .set('cookie', cookie)
        .send({
          name: 'inb4.us',
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
    });
  });

  it('should fail if the user does not own that dib', function(done) {
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.dibs = [uuid.v4()];
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/dibs/delete')
        .set('cookie', cookie)
        .send({
          name: 'inb4.us',
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
        .post('/api/dibs/delete')
        .set('cookie', cookie)
        .send({
          name: 'inb4.us',
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
    });
  });
});