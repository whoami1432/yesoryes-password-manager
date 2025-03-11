'use strict';

const express = require('express');

const router = express.Router();

const users = require('../controllers/users.controller');
const validator = require('../middleware/validator.middleware');
const { loginLimiter, passwordResetLimiter } = require('../../middlewares/rateLimiter');
const { authourize, roleAuthourize } = require('../utils/autherize');

router.post('/register', validator('userRegister'), users.userRegister);
router.post('/login', loginLimiter, users.userLogin);
router.post('/email-verification', users.emailVerification);
router.post('/password-reset', passwordResetLimiter, validator('passwordReset'), users.passwordReset);
router.get('/admin/list', authourize, roleAuthourize(['admin']), users.listAllUsers);
router.put('/admin/update-role', authourize, roleAuthourize(['admin']), users.updateRoles);
router.delete('/admin/manage/:id/:isDeleted', authourize, roleAuthourize(['admin']), users.enableOrdDisableUsers);
router.put('/password', authourize, roleAuthourize(['admin', 'user']), validator('passwordUpdate'), users.passwordUpdate);
router.get('/:id', authourize, roleAuthourize(['admin', 'user']), users.getUserDetails);
router.put('/:id', authourize, roleAuthourize(['admin', 'user']), validator('updateUser'), users.updateUserDetails);

module.exports = router;
