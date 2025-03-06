'use strict';
const express = require('express');

const router = express.Router();

const helloWorld = require('../controllers/helloWorld.controller');
const { authourize, roleAuthourize } = require('../utils/autherize');

router.get('/helloworld', helloWorld.helloWorld);
router.get('/helloworld/1', authourize, roleAuthourize(['user', 'admin']), helloWorld.helloWorld1);
router.get('/helloworld/2', authourize, roleAuthourize(['admin']), helloWorld.helloWorld2);

module.exports = router;
