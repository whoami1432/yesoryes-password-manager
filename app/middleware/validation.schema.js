const Joi = require('joi');

const schemas = {
	userRegister: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		mobileNumber: Joi.number().required(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
		confirmPassword: Joi.ref('password'),
		country: Joi.string().required(),
		city: Joi.string().required(),
		state: Joi.string().required(),
		gender: Joi.string().required()
	}),

	passwordReset: Joi.object().keys({
		email: Joi.string().email().required(),
		mobileNumber: Joi.number().required(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
		confirmPassword: Joi.ref('password')
	}),

	passwordUpdate: Joi.object().keys({
		id: Joi.string().required(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
		confirmPassword: Joi.ref('password')
	}),

	updateUser: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		mobileNumber: Joi.number().required(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
		confirmPassword: Joi.ref('password'),
		country: Joi.string().required(),
		city: Joi.string().required(),
		state: Joi.string().required(),
		gender: Joi.string().required()
	})
};

module.exports = schemas;
