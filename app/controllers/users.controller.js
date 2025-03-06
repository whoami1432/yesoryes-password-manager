'use strict';

const crypto = require('node:crypto');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const { logger } = require('../../config/logger');
const userModel = require('../models/users.model');
const { default: mongoose } = require('mongoose');

const algorithm = process.env.ENCRYPTION_ALGORITHM;
const secretKeyEnv = process.env.ENCRYPTION_SECRET_KEY;
const secretKey = crypto.createHash('sha256').update(secretKeyEnv).digest();

exports.userRegister = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `User register request received` });

		/** Joi validator using validate the request data */
		const schema = Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			mobileNumber: Joi.number().required(),
			password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
			confirmPassword: Joi.ref('password'),
			country: Joi.string().required(),
			city: Joi.string().required(),
			state: Joi.string().required(),
			gender: Joi.string().required()
		});

		const options = {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true
		};

		/** Passing the reques details into validater */
		const { error } = schema.validate(req.body, options);

		/** Check if any error is available request data if error occured pass into UI */
		if (error) {
			const errorMessage = error?.details && error?.details.length && error?.details[0]?.message ? error?.details[0]?.message : 'Missing required Field';
			return res.status(400).json({
				message: errorMessage,
				data: []
			});
		}

		logger.info({ requestId: req.id, message: `User request validation completed` });

		const { _id } = (await userModel.findOne({ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { _id: 1 })) || {};
		if (_id) {
			logger.info({ requestId: req.id, message: `User already registered` });

			return res.status(200).json({
				message: 'User Already Exists',
				data: []
			});
		}

		logger.info({ requestId: req.id, message: `Going to encrypt the password` });

		const body = req.body;

		const cipher = crypto.createCipheriv(algorithm, secretKey, null); // No IV needed
		const encrypted = cipher.update(body.password, 'utf8', 'hex');
		const encryptedPassword = encrypted + cipher.final('hex');

		delete body.password;
		body.password = encryptedPassword;

		logger.info({ requestId: req.id, message: `Encrypt the password completed` });

		const data = await userModel.create(body);
		if (data?._id) {
			logger.info({ requestId: req.id, message: `User Registered Successfully` });
			return res.status(201).json({
				Message: 'User Registered Successfully please check your email for verification',
				data: []
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.userLogin = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `User register request received` });

		if (!req.body.email || !req.body.password) {
			logger.info({ requestId: req.id, message: `Required field not found` });
			return res.status(400).json({
				message: 'Email and Password are required',
				data: []
			});
		}

		const { _id, name, gender, email, password, role } = await userModel.findOne({ email: req.body.email, isDeleted: false }, { _id: 1, name: 1, gender: 1, email: 1, password: 1, role: 1 });
		if (!_id) {
			logger.info({ requestId: req.id, message: `User not foud` });
			return res.status(200).json({
				message: 'User not found',
				data: []
			});
		}

		const decipher = crypto.createDecipheriv(algorithm, secretKey, null);
		const decrypted = decipher.update(password, 'hex', 'utf8');
		const decryptedDBPassword = decrypted + decipher.final('utf8');

		if (_id && req.body.password === decryptedDBPassword) {
			const token = jwt.sign({ username: name, gender, email, role }, secretKeyEnv, { expiresIn: '5h' });
			logger.info({ requestId: req.id, message: `Login Successfully` });
			return res.status(200).json({
				Message: 'User Login Successfully',
				data: {
					token,
					role
				}
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.emailVerification = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `Email verification request received` });

		const { id } = req.body;

		if (!id || !mongoose.isValidObjectId(id)) {
			logger.info({ requestId: req.id, message: `Required field not found` });
			return res.status(400).json({
				message: 'User is required',
				data: []
			});
		}

		const isUpdated = await userModel.findOneAndUpdate({ _id: id }, { $set: { isEmailVerified: true } }, { new: true });
		console.log(isUpdated);
		if (isUpdated?._id) {
			logger.info({ requestId: req.id, message: `Email Verified Successfully` });
			return res.status(200).json({
				Message: 'Email Verified Successfully',
				data: isUpdated
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.passwordReset = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `Password reset request received` });

		const schema = Joi.object().keys({
			email: Joi.string().email().required(),
			mobileNumber: Joi.number().required(),
			password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
			confirmPassword: Joi.ref('password')
		});

		const options = {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true
		};

		/** Passing the reques details into validater */
		const { error } = schema.validate(req.body, options);

		/** Check if any error is available request data if error occured pass into UI */
		if (error) {
			const errorMessage = error?.details && error?.details.length && error?.details[0]?.message ? error?.details[0]?.message : 'Missing required Field';
			return res.status(400).json({
				message: errorMessage,
				data: []
			});
		}

		const { _id, isEmailVerified } =
			(await userModel.findOne(
				{
					$or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }]
				},
				{ _id: 1 }
			)) || {};

		if (!_id) {
			logger.info({ requestId: req.id, message: `User not found` });
			return res.status(200).json({
				message: 'User not found',
				data: []
			});
		}

		if (!isEmailVerified) {
			logger.info({ requestId: req.id, message: `Email not verified` });
			return res.status(200).json({
				message: 'Email not verified',
				data: []
			});
		}

		const { email: userEmail, mobileNumber: userMobile, password: userPassword } = req.body;

		const isUpdated = await userModel.findOneAndUpdate({ email: userEmail, mobileNumber: userMobile }, { $set: { password: userPassword, emailVerification: false } }, { new: true });

		if (isUpdated?._id) {
			logger.info({ requestId: req.id, message: `Please verify your mail for password reset` });
			return res.status(200).json({
				Message: 'Email verification sent successfully for password reset',
				data: isUpdated
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.listAllUsers = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `Admin all users list received` });

		const allUsers = await userModel.find({}, { password: 0 });
		if (allUsers?.length > 0) {
			return res.status(200).json({
				Message: 'All users list retrived successsfully',
				data: allUsers
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.updateRoles = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `Update role req received` });

		const { id, role } = req.body;

		if (!id || !role || !mongoose.isValidObjectId(id) || !['public', 'user', 'admin'].includes(role)) {
			logger.info({ requestId: req.id, message: `Required field not found` });
			return res.status(400).json({
				message: 'User and Role are required',
				data: []
			});
		}

		const isRoleUpdated = await userModel.findOneAndUpdate({ _id: id }, { $set: { role } }, { new: true });

		if (isRoleUpdated?._id) {
			logger.info({ requestId: req.id, message: `Role Updated Successfully` });
			return res.status(200).json({
				Message: 'Role Updated Successfully',
				data: []
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.enableOrdDisableUsers = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `Manage users req received` });

		const { id, isDeleted } = req.params;

		if (!id || !mongoose.isValidObjectId(id)) {
			logger.info({ requestId: req.id, message: `Required field not found` });
			return res.status(400).json({
				message: 'Required field not found',
				data: []
			});
		}

		if (isDeleted === 'true') {
			const isRoleUpdated = await userModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true });
			if (isRoleUpdated?._id) {
				return res.status(200).json({
					Message: 'User Deactivated  Successfully',
					data: []
				});
			}
		} else if (isDeleted === 'false') {
			const isRoleUpdated = await userModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: false } }, { new: true });
			if (isRoleUpdated?._id) {
				return res.status(200).json({
					Message: 'User Activated  Successfully',
					data: []
				});
			}
		} else {
			return res.status(400).json({
				Message: 'Invalid Request',
				data: []
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.passwordUpdate = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `Password upadee req received` });

		/** Joi validator using validate the request data */
		const schema = Joi.object().keys({
			id: Joi.string().required(),
			password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
			confirmPassword: Joi.ref('password')
		});

		const options = {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true
		};

		/** Passing the reques details into validater */
		const { error } = schema.validate(req.body, options);

		/** Check if any error is available request data if error occured pass into UI */
		if (error) {
			const errorMessage = error?.details && error?.details.length && error?.details[0]?.message ? error?.details[0]?.message : 'Missing required Field';
			return res.status(400).json({
				message: errorMessage,
				data: []
			});
		}

		if (!mongoose.isValidObjectId(req.body.id)) {
			logger.info({ requestId: req.id, message: `Required field not found` });
			return res.status(400).json({
				message: 'Not a valid input',
				data: []
			});
		}

		const cipher = crypto.createCipheriv(algorithm, secretKey, null); // No IV needed
		const encrypted = cipher.update(req.body.password, 'utf8', 'hex');
		const encryptedPassword = encrypted + cipher.final('hex');

		logger.info({ requestId: req.id, message: `Encrypt the password completed` });

		const data = await userModel.findOneAndUpdate({ _id: req.body.id }, { $set: { password: encryptedPassword } }, { new: true });

		if (data?._id) {
			return res.status(200).json({
				Message: 'Password updated successfully',
				data: []
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.getUserDetails = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `User details req received` });

		const { id } = req.params;

		if (!mongoose.isValidObjectId(id)) {
			logger.info({ requestId: req.id, message: `Required field not found` });
			return res.status(400).json({
				message: 'Not a valid input',
				data: []
			});
		}

		const data = await userModel.findOne(
			{ _id: id, isDeleted: false },
			{
				name: 1,
				email: 1,
				mobileNumber: 1,
				country: 1,
				city: 1,
				state: 1,
				gender: 1,
				role: 1
			}
		);

		if (data?._id) {
			return res.status(200).json({
				Message: 'User details retrived successfully',
				data: data
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.updateUserDetails = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `User details req received` });

		/** Joi validator using validate the request data */
		const schema = Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			mobileNumber: Joi.number().required(),
			password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
			confirmPassword: Joi.ref('password'),
			country: Joi.string().required(),
			city: Joi.string().required(),
			state: Joi.string().required(),
			gender: Joi.string().required()
		});

		const options = {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true
		};

		/** Passing the reques details into validater */
		const { error } = schema.validate(req.body, options);

		/** Check if any error is available request data if error occured pass into UI */
		if (error) {
			const errorMessage = error?.details && error?.details.length && error?.details[0]?.message ? error?.details[0]?.message : 'Missing required Field';
			return res.status(400).json({
				message: errorMessage,
				data: []
			});
		}

		const { id } = req.params;

		if (!mongoose.isValidObjectId(id)) {
			logger.info({ requestId: req.id, message: `Required field not found` });
			return res.status(400).json({
				message: 'Not a valid input',
				data: []
			});
		}

		const data = await userModel.findOneAndUpdate(
			{
				_id: id
			},
			{
				$set: { ...req.body, modifiedDate: new Date() }
			},
			{
				new: true
			}
		);

		if (data?._id) {
			return res.status(200).json({
				Message: 'User details updated successfully',
				data: data
			});
		}
	} catch (error) {
		next(error);
	}
};
