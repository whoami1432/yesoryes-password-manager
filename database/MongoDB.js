'use strict';

const mongoose = require('mongoose');
const { logger } = require('../config/logger');

const mongoConnect = async (retries = 5, delay = 5000) => {
	while (retries) {
		try {
			console.log('Attempting to connect to MongoDB with connection string:', process.env.MONGODB_CONNECTION_STRING);
			await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
				maxPoolSize: 50, // Increase pool size for handling high traffic
				serverSelectionTimeoutMS: 10000, // Increase timeout to 10s
				socketTimeoutMS: 60000 // Close sockets after 60s
			});
			console.log('\nMongoDB Connected...');
			logger.info({ requestId: '', message: `Mongodb Connected` });
			break; // Exit loop if connection is successful
		} catch (error) {
			console.error('MongoDB Connection Error:', error);
			logger.error({ requestId: '', message: `MongoDB Connection Error: ${error.message}` });
			retries -= 1;
			if (retries === 0) {
				logger.error({ requestId: '', message: 'All retries failed. Exiting process.' });
				process.exit(1); // Exit process if all retries fail
			}
			console.log(`Retrying in ${delay / 1000} seconds...`);
			await new Promise(res => setTimeout(res, delay)); // Wait before retrying
		}
	}
};

module.exports = { mongoConnect };
