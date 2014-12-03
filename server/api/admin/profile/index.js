'use strict';

var express = require('express');
var getController = require('./getProfile.controller');
var postController = require('./updateProfile.controller');

var router = express.Router();

router.get('/', getController.index);
router.post('/', postController.index);

module.exports = router;