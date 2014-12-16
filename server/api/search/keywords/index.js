'use strict';

var express = require('express');
var controller = require('./keywords.controller');

var router = express.Router();

router.get('/:id([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$)', controller.index);
router.get('/:name', controller.index);
router.get('/', controller.index);

module.exports = router;