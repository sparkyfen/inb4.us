/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/user', require('./api/user/profile'));
  app.use('/api/user/delete', require('./api/user/delete'));
  app.use('/api/user/reset', require('./api/user/reset'));
  app.use('/api/user/change', require('./api/user/change'));
  app.use('/api/user/lost', require('./api/user/lost'));
  app.use('/api/user/activate', require('./api/user/activate'));
  app.use('/api/user/logout', require('./api/user/logout'));
  app.use('/api/user/register', require('./api/user/register'));
  app.use('/api/user/login', require('./api/user/login'));

  app.use('/api/dibs', require('./api/dibs'));
  app.use('/api/dibs/edit', require('./api/dibs/edit'));
  app.use('/api/dibs/report', require('./api/dibs/report'));
  app.use('/api/dibs/deactivate', require('./api/dibs/deactivate'));
  app.use('/api/dibs/delete', require('./api/dibs/delete'));

  app.use('/api/admin', require('./api/admin/profile'));
  app.use('/api/admin/logout', require('./api/admin/logout'));
  app.use('/api/admin/login', require('./api/admin/login'));
  app.use('/api/admin/register', require('./api/admin/register'));
  app.use('/api/admin/activate', require('./api/admin/activate'));

  app.use('/api/search/users/', require('./api/search/users'));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
