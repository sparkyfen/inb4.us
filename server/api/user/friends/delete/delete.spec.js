'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var request = require('supertest');
var uuid = require('node-uuid');
var app = require('../../../../app');
var db = require('../../../../components/database');
var userSchema = require('../../../../components/schema/user');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

var cookie;
var adminId, userId, friendId;

describe('POST /api/user/friends/delete', function() {

  beforeEach(function (done) {
    friendId = uuid.v4();
    adminId = uuid.v4();
    userId = uuid.v4();
    userSchema._id = friendId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockfriend';
    userSchema.email = 'mockfriend@inb4.us';
    userSchema.active = true;
    userSchema.friends = [{
      id: adminId,
      accepted: true
    }, {
      id: userId,
      accepted: true
    }];
    utils.insert(utils.users, friendId, userSchema, function (error) {
      if(error) {
        return done(error);
      }
      userSchema._id = adminId;
      userSchema.password = bcrypt.hashSync('mockpassword', 10);
      userSchema.username = 'mockadmin';
      userSchema.email = 'mockadmin@inb4.us';
      userSchema.active = true;
      userSchema.admin = true;
      userSchema.friends = [{
        id: userId,
        accepted: true
      }, {
        id: friendId,
        accepted: true
      }];
      utils.insert(utils.users, adminId, userSchema, function (error) {
        if(error) {
          return done(error);
        }
        userSchema._id = userId;
        userSchema.password = bcrypt.hashSync('mockpassword', 10);
        userSchema.username = 'mockuser';
        userSchema.email = 'mockuser@inb4.us';
        userSchema.active = true;
        userSchema.admin = false;
        userSchema.friends = [{
          id: adminId,
          accepted: true
        }, {
          id: friendId,
          accepted: true
        }];
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

  it('should successfully delete an admin friend', function(done) {
    request(app)
    .post('/api/user/friends/delete')
    .set('cookie', cookie)
    .send({
      id: adminId
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

  it('should successfully delete an friend', function(done) {
    request(app)
    .post('/api/user/friends/delete')
    .set('cookie', cookie)
    .send({
      id: friendId
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

  it('should fail if not authenticated', function(done) {
    request(app)
    .post('/api/user/friends/delete')
    .send({
      id: friendId
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

  it('should fail when the user does not exist', function (done) {
    users.deleteByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/friends/delete')
      .set('cookie', cookie)
      .send({
        id: friendId
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
        .post('/api/user/friends/delete')
        .set('cookie', cookie)
        .send({
          id: friendId
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

  it('should fail if the user has no friends', function(done) {
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      user.friends = [];
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/user/friends/delete')
        .set('cookie', cookie)
        .send({
          id: friendId
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

  it('should fail if the friend does not exist for that user', function(done) {
    users.searchByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      var friendIds = user.friends.map(function (friend) {
        return friend.id;
      });
      var friendIdIndex = friendIds.indexOf(friendId);
      user.friends.splice(friendIdIndex, 1);
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/user/friends/delete')
        .set('cookie', cookie)
        .send({
          id: friendId
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

  it('should fail if friend does not exist', function(done) {
    users.deleteByUsername('mockfriend', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/friends/delete')
      .set('cookie', cookie)
      .send({
        id: friendId
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

  it('should fail if the user does not exist for that friend', function(done) {
    users.searchByUsername('mockfriend', function (error, reply) {
      if(error) {
        return done(error);
      }
      var user = reply.rows[0].value;
      var friendIds = user.friends.map(function (friend) {
        return friend.id;
      });
      var friendIdIndex = friendIds.indexOf(userId);
      user.friends.splice(friendIdIndex, 1);
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          return done(error);
        }
        request(app)
        .post('/api/user/friends/delete')
        .set('cookie', cookie)
        .send({
          id: friendId
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