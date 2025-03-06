'use strict';

const express = require('express');

const router = express.Router();

const users = require('../controllers/users.controller');
const { loginLimiter, passwordResetLimiter } = require('../../middlewares/rateLimiter');
const { authourize, roleAuthourize } = require('../utils/autherize');

router.post('/register', users.userRegister);
router.post('/login', loginLimiter, users.userLogin);
router.post('/email-verification', users.emailVerification);
router.post('/password-reset', passwordResetLimiter, users.passwordReset);
router.get('/admin/list', authourize, roleAuthourize(['admin']), users.listAllUsers);
router.put('/admin/update-role', authourize, roleAuthourize(['admin']), users.updateRoles);
router.delete('/admin/manage/:id/:isDeleted', authourize, roleAuthourize(['admin']), users.enableOrdDisableUsers);
router.put('/password', authourize, roleAuthourize(['admin', 'user']), users.passwordUpdate);
router.get('/:id', authourize, roleAuthourize(['admin', 'user']), users.getUserDetails);
router.put('/:id', authourize, roleAuthourize(['admin', 'user']), users.updateUserDetails);

module.exports = router;
