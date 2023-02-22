const mongoose = require('mongoose');
const config = require('config');
const logger = require('../../utils/logger');

const { connectionString = null } = config.get('db.mongodb');

const connect = async () => {
    try {
        await mongoose.connect(connectionString);
        logger.info('Successfully connected to mongoDB!');
    } catch (error) {
        logger.error({
            error,
            message: 'Failed connecting to mongoDB!',
        });
        process.exit(1);
    }
};

const disconnect = async () => {
    await mongoose.disconnect();
};

module.exports = {
    connect,
    disconnect,
};
