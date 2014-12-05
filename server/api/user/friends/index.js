'use strict';

var express = require('express');
var getController = require('./getFriends.controller');
var postController = require('./addFriends.controller');

var router = express.Router();

router.get('/', getController.index);
router.post('/', postController.index);

module.exports = router;