'use strict';

// Production specific configuration
// =================================
module.exports = {
  domain: 'https://inb4.us',
  // Server IP
  ip:  process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,
  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,
   // CouchDB
  couchdb: {
    url: process.env.INB4_COUCHDB_URL || 'http://127.0.0.1:5984/',
    users: process.env.INB4_COUCHDB_USERS || 'inb4-users',
    admins: process.env.INB4_COUCHDB_ADMINS || 'inb4-admins',
    dibs: process.env.INB4_COUCHDB_DIBS || 'inb4-dibs',
    keywords: process.env.INB4_COUCHDB_KEYWORDS || 'inb4-keywords'
  },
  email: {
    accounts: {
      sendgrid: {
        username: process.env.INB4_SENDGRID_USERNAME || '',
        password: process.env.INB4_SENDGRID_PASSWORD || ''
      },
      info: {
        username: process.env.INB4_EMAIL_INFO_USERNAME || ''
      }
    }
  },
  cookie: {
    secret: process.env.INB4_COOKIE_SECRET || 'dlfjsldkfj;lskjf;lskjdf;lskdjf;lskjd;lkdjf;lkj;ldkj;slkjf;dlskjfs;lfjd;lfjd'
  }
};