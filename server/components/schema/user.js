'use strict';

module.exports = {
  username: '',
  firstname: '',
  lastname: '',
  password: null,
  email: '',
  tokens: {
    activate: null,
    reset: null
  },
  active: false,
  admin: false,
  friends: [], // {id: '', accepted: true/false}
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