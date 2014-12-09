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
    dibs: process.env.INB4_COUCHDB_DIBS || 'inb4-dibs',
    keywords: process.env.INB4_COUCHDB_KEYWORDS || 'inb4-keywords'
  },
  email: {
    accounts: {
      sendgrid: {
        username: process.env.INB4_SENDGRID_USERNAME || '',
        password: process.env.INB4_SENDGRID_PASSWORD || ''
      },
      info: process.env.INB4_EMAIL_INFO_USERNAME || 'info@inb4.us',
      forward: {
        from: process.env.INB4_EMAIL_FORWARD_FROM || 'forward@inb4.us',
        to: process.env.INB4_EMAIL_FORWARD_TO || ''
      }
    }
  },
  usps: {
    server: process.env.USPS_SERVER || 'https://secure.shippingapis.com/ShippingAPI.dll',
    userId: process.env.USPS_USERID || '' // https://www.usps.com/business/web-tools-apis/welcome.htm
  },
  smartystreets: {
    authId: process.env.SMARTYSTREETS_AUTH_ID || '', // https://smartystreets.com/account/keys
    authToken: process.env.SMARTYSTREETS_AUTH_TOKEN || ''
  },
  admin: {
    username: process.env.INB4_ADMIN_USERNAME || 'inb4-admin',
    password: process.env.INB4_ADMIN_PASSWORD || 'dxk8Yl*AfDySF9gWDA07Ir9WTopOZGjjLIicY1&ejzPKe3aDbu2Tacc08MeFLI8ARupT@q1ZPKWfsfSFZrt@&@Wuk5!5Cb4@rEa',
    email: process.env.INB4_ADMIN_EMAIL || 'admin@inb4.us'
  },
  cookie: {
    secret: process.env.INB4_COOKIE_SECRET || 'dlfjsldkfj;lskjf;lskjdf;lskdjf;lskjd;lkdjf;lkj;ldkj;slkjf;dlskjfs;lfjd;lfjd'
  }
};