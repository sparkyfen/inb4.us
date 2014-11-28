'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:  process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,
  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  cookie: {
    secret: process.env.INB4_COOKIE_SECRET || 'dlfjsldkfj;lskjf;lskjdf;lskdjf;lskjd;lkdjf;lkj;ldkj;slkjf;dlskjfs;lfjd;lfjd'
  }
};