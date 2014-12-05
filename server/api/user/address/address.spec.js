'use strict';

var should = require('should');
var bcrypt = require('bcrypt');
var querystring = require('querystring');
var fs = require('fs');
var nock = require('nock');
var request = require('supertest');
var uuid = require('node-uuid');
var app = require('../../../app');
var config = require('../../../config/environment');
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

    nock('https://api.smartystreets.com')
    .get('/street-address?' + querystring.stringify({
      'auth-id': config.smartystreets.authId,
      'auth-token': config.smartystreets.authToken,
      street: '1234 E. Melon Rd.',
      street2: null,
      city: 'Tempe',
      state: 'AZ',
      zipcode: 85281,
      candidates: 5
    }))
    .reply(200, [{
        "input_index":0,
        "candidate_index":0,
        "delivery_line_1":"1234 E. E. Melon Rd.",
        "last_line":"Tempe AZ 85281-6810",
        "delivery_point_barcode":"852816810223",
        "components": {
          "primary_number":"1234",
          "street_predirection":"E",
          "street_name":"Melon",
          "street_suffix":"Rd",
          "city_name":"Tempe",
          "state_abbreviation":"AZ",
          "zipcode":"85281",
          "plus4_code":"6810",
          "delivery_point":"22",
          "delivery_point_check_digit":"3"
        },
        "metadata": {
          "record_type":"H",
          "zip_type":"Standard",
          "county_fips":"04013",
          "county_name":"Maricopa",
          "carrier_route":"C015",
          "congressional_district":"09",
          "rdi":"Residential",
          "elot_sequence":"0102",
          "elot_sort":"A",
          "latitude":33.00000,
          "longitude":-111.00000,
          "precision":"Zip9",
          "time_zone":"Mountain",
          "utc_offset":-7
        },
        "analysis":{
          "dpv_match_code":"Y",
          "dpv_footnotes":"AABB",
          "dpv_cmra":"N",
          "dpv_vacant":"N",
          "active":"Y",
          "footnotes":"N#"
        }
      }
    ]);
    var userId = uuid.v4();
    userSchema._id = userId;
    userSchema.password = bcrypt.hashSync('mockpassword', 10);
    userSchema.username = 'mockuser';
    userSchema.email = 'mockuser@inb4.us';
    userSchema.active = true;
    utils.insert(utils.users,
     userId, userSchema, function (error) {
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