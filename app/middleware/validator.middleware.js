const { logger } = require('../../config/logger');
const schemas = require('./validation.schema');

const validationOptions = {
	abortEarly: false,
	allowUnknown: true,
	stripUnknown: true
};

const validator = schemaName => {
	return (req, res, next) => {
		const schema = schemas[schemaName];
		if (!schema) {
			return res.status(500).json({ message: 'Invalid schema' });
		}

		const { error } = schema.validate(req.body, validationOptions);

		if (error) {
			logger.info({ requestId: req.id, message: `Validation error in ${schemaName}` });
			const errorMessage = error?.details && error?.details.length && error?.details[0]?.message ? error?.details[0]?.message : 'Missing required Field';

			return res.status(400).json({
				message: errorMessage,
				data: []
			});
		}

		next();
	};
};

module.exports = validator;
