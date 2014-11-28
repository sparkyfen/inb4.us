'use strict';

var uuid = require('node-uuid');

module.exports = {
  id: uuid.v4(),
  username: '',
  firstname: '',
  lastname: '',
  password: null,
  email: '',
  tokens: {
    activate: uuid.v4(),
    reset: null
  },
  dibs: [],
  address: {
    streetAddress: null,
    unitAddress: null,
    city: null,
    state: null,
    country: 'United States',
    zipcode: null
  }
};