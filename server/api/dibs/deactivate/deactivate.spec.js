'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');
var app = require('../../../app');
var userSchema = require('../../../components/schema/user');
var adminSchema = require('../../../components/schema/admin');
var dibSchema = require('../../../components/schema/dib');
var db = require('../../../components/database');
var users = db.user;
users.initialize();
var admins = db.admin;
admins.initialize();
var dibs = db.dib;
dibs.initialize();
var utils = db.utils;
utils.initialize();

var dibId;
var cookie;

describe('POST /api/dibs/deactivate', function() {

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
      dibId = uuid.v4();
      dibSchema._id = dibId;
      dibSchema.name = 'inb4.us';
      dibSchema.type = 'thing';
      dibSchema.creator = adminId;
      dibSchema.dates.created = Date.now(Date.UTC());
      utils.insert(utils.dibs, dibId, dibSchema, function (error) {
        if(error) {
          return done(error);
        }
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
      });
    });
  });

  it('should successfully deactivate a dib', function(done) {
    request(app)
    .post('/api/dibs/deactivate')
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

  it('should fail when an admin is not signed in', function(done) {
    request(app)
    .post('/api/dibs/deactivate')
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

  it('should fail when an user is signed in but not an admin', function(done) {
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
        request(app)
        .post('/api/dibs/deactivate')
        .set('cookie', cookie)
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
    });
  });

  it('should fail when missing the dib id', function(done) {
    request(app)
    .post('/api/dibs/deactivate')
    .set('cookie', cookie)
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

  it('should fail when the dib id is invalid', function(done) {
    request(app)
    .post('/api/dibs/deactivate')
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

  it('should fail when the dib id is invalid', function(done) {
    request(app)
    .post('/api/dibs/deactivate')
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

  it('should fail when the dib id does not exist', function(done) {
    request(app)
    .post('/api/dibs/deactivate')
    .set('cookie', cookie)
    .send({
      id: uuid.v4()
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