'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var fs = require('fs');
var nock = require('nock');
var request = require('supertest');
var uuid = require('node-uuid');
var app = require('../../../app');
var db = require('../../../components/database');
var userSchema = require('../../../components/schema/user');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

var cookie;

describe('POST /api/user/address', function() {

  beforeEach(function (done) {
    nock('https://secure.shippingapis.com')
    .filteringPath(/.*/, '*')
    .get('*')
    .reply(200, fs.readFileSync(__dirname + '/lookup_good_response.xml', {encoding: 'utf8'}));

    nock('https://secure.shippingapis.com')
    .filteringPath(/.*/, '*')
    .get('*')
    .reply(200, fs.readFileSync(__dirname + '/lookup_bad_response.xml', {encoding: 'utf8'}));

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
          done();
        });
      });
    });
  });

  it('should successfully update the user address', function(done) {
    request(app)
    .post('/api/user/address')
    .set('cookie', cookie)
    .send({
      streetAddress: '1234 E. Melon Rd.',
      unitAddress: null,
      city: 'Tempe',
      state: 'AZ',
      zipcode: '85281'
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

  it('should successfully update the user address with a long state value', function(done) {
    request(app)
    .post('/api/user/address')
    .set('cookie', cookie)
    .send({
      streetAddress: '1234 E. Melon Rd.',
      unitAddress: null,
      city: 'Tempe',
      state: 'Arizona',
      zipcode: '85281'
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
    .post('/api/user/address')
    .send({
      streetAddress: '1234 E. Melon Rd.',
      unitAddress: null,
      city: 'Tempe',
      state: 'AZ',
      zipcode: '85281'
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

  it('should fail missing the street address', function(done) {
    request(app)
    .post('/api/user/address')
    .set('cookie', cookie)
    .send({
      unitAddress: null,
      city: 'Tempe',
      state: 'AZ',
      zipcode: '85281'
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

  it('should fail missing the city', function(done) {
    request(app)
    .post('/api/user/address')
    .set('cookie', cookie)
    .send({
      streetAddress: '1234 E. Melon Rd.',
      unitAddress: null,
      state: 'AZ',
      zipcode: '85281'
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

  it('should fail missing the state', function(done) {
    request(app)
    .post('/api/user/address')
    .set('cookie', cookie)
    .send({
      streetAddress: '1234 E. Melon Rd.',
      unitAddress: null,
      city: 'Tempe',
      zipcode: '85281'
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

  it('should fail missing the zipcode', function(done) {
    request(app)
    .post('/api/user/address')
    .set('cookie', cookie)
    .send({
      streetAddress: '1234 E. Melon Rd.',
      unitAddress: null,
      city: 'Tempe',
      state: 'AZ'
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

  it('should fail when the user does not exist', function (done) {
    users.deleteByUsername('mockuser', function (error, reply) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/address')
      .set('cookie', cookie)
      .send({
        streetAddress: '1234 E. Melon Rd.',
        unitAddress: null,
        city: 'Tempe',
        state: 'AZ',
        zipcode: '85281'
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
        .post('/api/user/address')
        .set('cookie', cookie)
        .send({
          streetAddress: '1234 E. Melon Rd.',
          unitAddress: null,
          city: 'Tempe',
          state: 'AZ',
          zipcode: '85281'
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