'use strict';

// Test specific configuration
// ===========================
module.exports = {
  domain: 'http://127.0.0.1',
  couchdb: {
    url: 'http://127.0.0.1:5984/',
    users: 'inb4-test-users',
    dibs: 'inb4-test-dibs',
    keywords: 'inb4-test-keywords'
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: 'testpassword'
  },
  usps: {
    server: 'https://secure.shippingapis.com/ShippingAPI.dll',
    userId: 'testUserId' // https://www.usps.com/business/web-tools-apis/welcome.htm
  },
  smartystreets: {
    authId: 'testAuthId', // https://smartystreets.com/account/keys
    authToken: 'testAuthToken'
  },
  admin: {
    username: 'inb4-test-admin',
    password: 'testpassword',
    email: 'test-admin@inb4.us'
  },
  catpcha: {
    secretKey: 'mySecretKey' // https://www.google.com/recaptcha/admin
  },
  dates: {
    purgeTime: 86400000 // Time in milliseconds
  },
  cookie: {
    secret: 'mySecret'
  }
};