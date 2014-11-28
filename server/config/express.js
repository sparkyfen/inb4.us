/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var helmet = require('helmet');
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser(config.cookie.secret));
  app.use(session({
    cookie: {
      path: '/',
      secure: false,
      maxAge: 3600000 * 24 * 7,
      httpOnly: true
    }
  }));
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts({
    maxAge: 10886400000,     // Must be at least 18 weeks to be approved by Google
    includeSubdomains: true, // Must be enabled to be approved by Google
    preload: true,
    force: true
  }));
  app.use(helmet.frameguard('deny'));

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.use('/api/docs', express.static(path.join(config.root, 'public/docs')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.use('/api/docs', express.static(path.join(config.root, 'client/docs/output')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};