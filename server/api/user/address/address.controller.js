'use strict';

var validator = require('validator');
var config = require('../../../config/environment');
var db = require('../../../components/database');
var addresses = require('../../../components/addresses');
var users = db.user;
users.initialize();
var utils = db.utils;
utils.initialize();

function _convertState(str) {
  var states = Object.freeze([{ name: 'ALABAMA', abbreviation: 'AL'}, { name: 'ALASKA', abbreviation: 'AK'}, { name: 'AMERICAN SAMOA', abbreviation: 'AS'}, { name: 'ARIZONA', abbreviation: 'AZ'}, { name: 'ARKANSAS', abbreviation: 'AR'}, { name: 'CALIFORNIA', abbreviation: 'CA'}, { name: 'COLORADO', abbreviation: 'CO'}, { name: 'CONNECTICUT', abbreviation: 'CT'}, { name: 'DELAWARE', abbreviation: 'DE'}, { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'}, { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'}, { name: 'FLORIDA', abbreviation: 'FL'}, { name: 'GEORGIA', abbreviation: 'GA'}, { name: 'GUAM', abbreviation: 'GU'}, { name: 'HAWAII', abbreviation: 'HI'}, { name: 'IDAHO', abbreviation: 'ID'}, { name: 'ILLINOIS', abbreviation: 'IL'}, { name: 'INDIANA', abbreviation: 'IN'}, { name: 'IOWA', abbreviation: 'IA'}, { name: 'KANSAS', abbreviation: 'KS'}, { name: 'KENTUCKY', abbreviation: 'KY'}, { name: 'LOUISIANA', abbreviation: 'LA'}, { name: 'MAINE', abbreviation: 'ME'}, { name: 'MARSHALL ISLANDS', abbreviation: 'MH'}, { name: 'MARYLAND', abbreviation: 'MD'}, { name: 'MASSACHUSETTS', abbreviation: 'MA'}, { name: 'MICHIGAN', abbreviation: 'MI'}, { name: 'MINNESOTA', abbreviation: 'MN'}, { name: 'MISSISSIPPI', abbreviation: 'MS'}, { name: 'MISSOURI', abbreviation: 'MO'}, { name: 'MONTANA', abbreviation: 'MT'}, { name: 'NEBRASKA', abbreviation: 'NE'}, { name: 'NEVADA', abbreviation: 'NV'}, { name: 'NEW HAMPSHIRE', abbreviation: 'NH'}, { name: 'NEW JERSEY', abbreviation: 'NJ'}, { name: 'NEW MEXICO', abbreviation: 'NM'}, { name: 'NEW YORK', abbreviation: 'NY'}, { name: 'NORTH CAROLINA', abbreviation: 'NC'}, { name: 'NORTH DAKOTA', abbreviation: 'ND'}, { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'}, { name: 'OHIO', abbreviation: 'OH'}, { name: 'OKLAHOMA', abbreviation: 'OK'}, { name: 'OREGON', abbreviation: 'OR'}, { name: 'PALAU', abbreviation: 'PW'}, { name: 'PENNSYLVANIA', abbreviation: 'PA'}, { name: 'PUERTO RICO', abbreviation: 'PR'}, { name: 'RHODE ISLAND', abbreviation: 'RI'}, { name: 'SOUTH CAROLINA', abbreviation: 'SC'}, { name: 'SOUTH DAKOTA', abbreviation: 'SD'}, { name: 'TENNESSEE', abbreviation: 'TN'}, { name: 'TEXAS', abbreviation: 'TX'}, { name: 'UTAH', abbreviation: 'UT'}, { name: 'VERMONT', abbreviation: 'VT'}, { name: 'VIRGIN ISLANDS', abbreviation: 'VI'}, { name: 'VIRGINIA', abbreviation: 'VA'}, { name: 'WASHINGTON', abbreviation: 'WA'}, { name: 'WEST VIRGINIA', abbreviation: 'WV'}, { name: 'WISCONSIN', abbreviation: 'WI'}, { name: 'WYOMING', abbreviation: 'WY' }]);
  str = str.toUpperCase();
  for (var i = 0; i < states.length; i++) {
    var state = states[i];
    if(str.length === 2 && state.abbreviation === str) {
      return state.abbreviation;
    }
    if(str.length !== 2 && state.name === str) {
      return state.abbreviation;
    }
  }
  return null;
}

function _validateAddress(address, callback) {
  if(validator.isNull(address.street1)) {
    return callback({code: 400, message: 'Missing street address.'});
  }
  if(validator.isNull(address.city)) {
    return callback({code: 400, message: 'Missing city.'});
  }
  if(validator.isNull(address.state)) {
    return callback({code: 400, message: 'Missing state'});
  }
  address.state = _convertState(address.state);
  if(validator.isNull(address.zipcode)) {
    return callback({code: 400, message: 'Missing zipcode.'});
  }
  addresses.smartyVerify(address, function (error, address) {
    if(error) {
      console.log(error);
      return callback({code: 500, message: 'Could not edit the address.'});
    }
    return callback(null, address);
  });
}

// Add an address to the user.
// Currently only supports US.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  var username = req.session.username;
  var streetAddress = req.body.streetAddress;
  var unitAddress = req.body.unitAddress;
  var city = req.body.city;
  var state = req.body.state;
  var country = 'United States';
  var zipcode = req.body.zipcode;
  _validateAddress({
    street1: streetAddress,
    street2: unitAddress,
    city: city,
    state: state,
    zipcode: zipcode
  }, function (error, address) {
    if(error) {
      return res.status(error.code).jsonp({message: error.message});
    }
    users.searchByUsername(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not edit the address.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'User does not exist.'});
      }
      var user = reply.rows[0].value;
      if(!user.active) {
        return res.status(400).jsonp({message: 'You must activate this account before using it.'});
      }
      user.address = address;
      utils.insert(utils.users, user._id, user, function (error) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not edit the address.'});
        }
        return res.jsonp({message: 'Address updated.'});
      });
    });
  });
};