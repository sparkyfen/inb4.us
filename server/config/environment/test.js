'use strict';

// Test specific configuration
// ===========================
module.exports = {
  domain: 'http://localhost:9000',
  couchdb: {
    url: 'http://127.0.0.1:5984/',
    users: 'inb4-test-users',
    admins: 'inb4-test-admins'
  },
  cookie: {
    secret: 'mySecret'
  }
};