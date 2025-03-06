'use strict';
const { logger } = require('../../config/logger');
const helloWorld = require('../models/helloWorld.model');

exports.helloWorld = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} helloworld received` });

		const data = await helloWorld.helloWorld();
		res.status(200).json({
			Message: 'Hello World1',
			data: data
		});
	} catch (error) {
		next(error);
	}
};

exports.helloWorld1 = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} helloworld received` });

		const data = await helloWorld.helloWorld();
		res.status(200).json({
			Message: 'USER and ADMIN protected route',
			data: data
		});
	} catch (error) {
		next(error);
	}
};

exports.helloWorld2 = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} helloworld received` });

		const data = await helloWorld.helloWorld();
		res.status(200).json({
			Message: 'User Protected route',
			data: data
		});
	} catch (error) {
		next(error);
	}
};
