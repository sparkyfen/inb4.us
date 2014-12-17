'use strict';

var express = require('express');
var getController = require('./getProfile.controller');
var postController = require('./updateProfile.controller');

var router = express.Router();

router.get('/', getController.index);
router.get('/:id([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$)', getController.index);
router.post('/', postController.index);

module.exports = router;