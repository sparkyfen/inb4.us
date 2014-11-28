/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/user', require('./api/user/profile'));
  app.use('/api/user/delete', require('./api/user/delete'));
  app.use('/api/user/reset', require('./api/user/resetPassword'));
  app.use('/api/user/activate', require('./api/user/activate'));
  app.use('/api/user/logout', require('./api/user/logout'));
  app.use('/api/user/register', require('./api/user/register'));
  app.use('/api/user/login', require('./api/user/login'));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
