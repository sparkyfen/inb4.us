'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var uuid = require('node-uuid');
var app = require('../../../app');
var db = require('../../../components/database');
var userSchema = require('../../../components/schema/user');
var adminSchema = require('../../../components/schema/admin');
var admins = db.admin;
admins.initialize();
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

var cookie;

describe('POST /api/user/friends', function() {

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
      var userId = uuid.v4();
      userSchema._id = userId;
      userSchema.password = bcrypt.hashSync('mockpassword', 10);
      userSchema.username = 'mockfriend';
      userSchema.email = 'mockfriend@inb4.us';
      userSchema.active = true;
      utils.insert(utils.users, userId, userSchema, function (error) {
        if(error) {
          return done(error);
        }
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

  it('should successfully add a friend', function(done) {
    request(app)
    .post('/api/user/friends')
    .set('cookie', cookie)
    .send({
      username: 'mockfriend'
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

  it('should successfully add the friend that is an admin', function(done) {
    request(app)
    .post('/api/user/friends')
    .set('cookie', cookie)
    .send({
      username: 'mockadmin'
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

  it('should fail when the user is not logged in', function(done) {
    request(app)
    .post('/api/user/friends')
    .send({
      username: 'mockfriend'
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

  it('should fail when the friend name is missing', function(done) {
    request(app)
    .post('/api/user/friends')
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

  it('should fail when the friend name and username are the same', function(done) {
    request(app)
    .post('/api/user/friends')
    .set('cookie', cookie)
    .send({
      username: 'mockuser'
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

  it('should fail when the user is already friends with the username', function(done) {
    request(app)
    .post('/api/user/friends')
    .set('cookie', cookie)
    .send({
      username: 'mockfriend'
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
      .post('/api/user/friends')
      .set('cookie', cookie)
      .send({
        username: 'mockfriend'
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

  it('should fail when the user does not exist', function(done) {
    users.deleteByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/friends')
      .set('cookie', cookie)
      .send({
        username: 'mockfriend'
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

  it('should fail when the friend does not exist', function(done) {
    users.deleteByUsername('mockfriend', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/friends')
      .set('cookie', cookie)
      .send({
        username: 'mockfriend'
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

  it('should fail when the friend does not exist and is an admin', function(done) {
    admins.deleteByUsername('mockadmin', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/friends')
      .set('cookie', cookie)
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
        .post('/api/user/friends')
        .set('cookie', cookie)
        .send({
          username: 'mockfriend'
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

  it('should fail on when your friend has an unactivated account', function(done) {
    users.searchByUsername('mockfriend', function (error, reply) {
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
        .post('/api/user/friends')
        .set('cookie', cookie)
        .send({
          username: 'mockfriend'
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

  it('should fail on when your friend has an unactivated account and is an admin', function(done) {
    admins.searchByUsername('mockadmin', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.active = false;
      utils.insert(utils.admins, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/user/friends')
        .set('cookie', cookie)
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
    });
  });
});