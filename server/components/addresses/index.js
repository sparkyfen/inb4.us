'use strict';

var request = require('request');
var USPS = require('usps-webtools');
var config = require('../../config/environment');
var usps = new USPS({
  server: config.usps.server,
  userId: config.usps.userId
});
var querystring = require('querystring');

exports.smartyVerify = function (address, callback) {
  request.get({
    url: 'https://api.smartystreets.com/street-address?' + querystring.stringify({
      'auth-id': config.smartystreets.authId,
      'auth-token': config.smartystreets.authToken,
      street: address.street1,
      street2: address.street2,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      candidates: 5
    }),
    headers: {
      'X-Suppress-Logging': true
    },
    forever: true,
    json: true
  }, function (error, resp, body) {
    if(error) {
      return callback(error);
    }
    if(resp.statusCode !== 200) {
      return callback(body);
    }
    var validAddress = {
      street1: body[0].components.primary_number + ' ' + body[0].components.street_name + ' ' + body[0].components.street_suffix,
      street2: (body[0].components.secondary_designator && body[0].components.secondary_number) ? body[0].components.secondary_designator + ' ' + body[0].components.secondary_number : null,
      city: body[0].components.city_name,
      state: body[0].components.state_abbreviation,
      zipcode: body[0].components.zipcode + '-' + body[0].components.plus4_code
    };
    return callback(null, validAddress);
  });
};

exports.uspsVerify = function(address, callback) {
  usps.verify({
    street1: address.street1,
    street2: address.street2,
    city: address.city,
    state: address.state,
    zip: address.zipcode
  }, function (error, address) {
    if(error) {
      return callback(error);
    }
    return callback(null, address);
  });
};