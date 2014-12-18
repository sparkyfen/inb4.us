/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/email', require('./api/email'));
  app.use('/api/user', require('./api/user/profile'));
  app.use('/api/user/check', require('./api/user/check'));
  app.use('/api/user/delete', require('./api/user/delete'));
  app.use('/api/user/reset', require('./api/user/reset'));
  app.use('/api/user/resend', require('./api/user/resend'));
  app.use('/api/user/change', require('./api/user/change'));
  app.use('/api/user/lost', require('./api/user/lost'));
  app.use('/api/user/activate', require('./api/user/activate'));
  app.use('/api/user/logout', require('./api/user/logout'));
  app.use('/api/user/register', require('./api/user/register'));
  app.use('/api/user/login', require('./api/user/login'));
  app.use('/api/user/purge', require('./api/user/purge'));
  app.use('/api/user/friends', require('./api/user/friends'));
  app.use('/api/user/friends/delete', require('./api/user/friends/delete'));
  app.use('/api/user/address', require('./api/user/address'));

  app.use('/api/dibs', require('./api/dibs'));
  app.use('/api/dibs/edit', require('./api/dibs/edit'));
  app.use('/api/dibs/reset', require('./api/dibs/reset'));
  app.use('/api/dibs/report', require('./api/dibs/report'));
  app.use('/api/dibs/deactivate', require('./api/dibs/deactivate'));
  app.use('/api/dibs/delete', require('./api/dibs/delete'));

  app.use('/api/search/users', require('./api/search/users'));
  app.use('/api/search/dibs', require('./api/search/dibs'));
  app.use('/api/search/keywords', require('./api/search/keywords'));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
