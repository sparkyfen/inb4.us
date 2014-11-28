'use strict';

// Development specific configuration
// ==================================
module.exports = {
  domain: 'http://localhost:9000',
  // CouchDB
  couchdb: {
    url: 'http://127.0.0.1:5984/',
    users: 'inb4-users',
    admins: 'inb4-admins'
  },
  email: {
    accounts: {
      info: {
        username: 'sparky1010@gmail.com',
        password: 'vfozzpbdaeyudljw'
      }
    }
  },
  cookie: {
    secret: 'l;sdkjf;slkfj;sldkjf;skf;ldkfj;sdlkfj;dlkj;sdlkfjs;ldjfd'
  }
};
