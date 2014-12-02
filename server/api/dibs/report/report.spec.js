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
var userId;
var cookie;

describe('POST /api/dibs/report', function() {

  beforeEach(function (done) {
    userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.active = true;
    utils.insert(utils.users, userId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      var newUserId = uuid.v4();
      userSchema._id = newUserId;
      userSchema.password = bcrypt.hashSync('mockpassword', 10);
      userSchema.username = 'newmockuser';
      userSchema.email = 'newmockuser@inb4.us';
      userSchema.active = true;
      utils.insert(utils.users, newUserId, userSchema, function (error) {
        if(error) {
          return done(error);
        }
        dibId = uuid.v4();
        dibSchema._id = dibId;
        dibSchema.name = 'inb4.us';
        dibSchema.type = 'thing';
        dibSchema.creator = newUserId;
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

  it('should successfully report a dib', function(done) {
    request(app)
    .post('/api/dibs/report')
    .set('cookie', cookie)
    .send({
      id: dibId,
      reason: 'Because I said so :)'
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

  it('should fail when the user is not signed in', function(done) {
    request(app)
    .post('/api/dibs/report')
    .send({
      id: dibId,
      reason: 'Because I said so :)'
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

  it('should fail when the id is missing', function(done) {
    request(app)
    .post('/api/dibs/report')
    .set('cookie', cookie)
    .send({
      reason: 'Because I said so :)'
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
    .post('/api/dibs/report')
    .set('cookie', cookie)
    .send({
      id: 'foobar',
      reason: 'Because I said so :)'
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

  it('should fail when the reason is missing', function(done) {
    request(app)
    .post('/api/dibs/report')
    .set('cookie', cookie)
    .send({
      id: dibId
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
    users.deleteByUsername('newmockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/dibs/report')
      .set('cookie', cookie)
      .send({
        id: dibId,
        reason: 'Because I said so :)'
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

  it('should fail when the dib does not exist', function(done) {
    request(app)
    .post('/api/dibs/report')
    .set('cookie', cookie)
    .send({
      id: uuid.v4(),
      reason: 'Because I said so :)'
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
        .post('/api/dibs/report')
        .set('cookie', cookie)
        .send({
          id: uuid.v4(),
          reason: 'Because I said so :)'
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

  it('should fail when reporting your own dib', function(done) {
    dibs.searchById(dibId, function (error, reply) {
      if(error) {
        return done(error);
      }
      var dib = reply.rows[0].value;
      dib.creator = userId;
      utils.insert(utils.dibs, dib._id, dib, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/dibs/report')
        .set('cookie', cookie)
        .send({
          id: uuid.v4(),
          reason: 'Because I said so :)'
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

  it('should fail when you have already reported the dib', function(done) {
    request(app)
    .post('/api/dibs/report')
    .set('cookie', cookie)
    .send({
      id: dibId,
      reason: 'Because I said so :)'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      request(app)
      .post('/api/dibs/report')
      .set('cookie', cookie)
      .send({
        id: dibId,
        reason: 'Because I said so :)'
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