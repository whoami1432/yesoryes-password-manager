'use strict';
const rateLimit = require('express-rate-limit');

const minitues = 2;
const limiter = rateLimit({
	windowMs: minitues * 60 * 1000, // 15 minutes
	max: 10000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: {
		status: 429,
		message: `Too many requests, please try again later after ${minitues} minitues.`
	} // Sent message to client too many requests are hitting
});

const loginLimiter = rateLimit({
	windowMs: minitues * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	keyGenerator: req => `login-${req.ip}`, // Custom key for login limiter
	message: {
		status: 429,
		message: `Too many requests, please try again later after ${minitues} minitues.`
	} // Sent message to client too many requests are hitting
});

const passwordResetLimiter = rateLimit({
	windowMs: minitues * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	keyGenerator: req => `reset-${req.ip}`, // Custom key for login limiter
	message: {
		status: 429,
		message: `Too many requests, please try again later after ${minitues} minitues.`
	} // Sent message to client too many requests are hitting
});

module.exports = { limiter, loginLimiter, passwordResetLimiter };
