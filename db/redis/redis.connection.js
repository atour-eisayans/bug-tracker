const config = require('config');
const redis = require('redis');
const { UnprocessableError } = require('../../errors');

const { connectionString = null } = config.get('db.redis');

class RedisConnection {
    constructor(url = null) {
        const connectionOptions = {};
        if (url || connectionString) {
            connectionOptions.url = url || connectionString;
        }
        this.client = redis.createClient(connectionOptions);
        this.client.on('error', (error) => {
            throw new UnprocessableError('Can not connect to redis server', {
                stack: error.stack,
                message: error.message,
                detail: error.detail,
            });
        });
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.disconnect();
    }
}

const redisConnection = new RedisConnection();

module.exports = {
    connect: redisConnection.connect,
    disconnect: redisConnection.disconnect,
    client: redisConnection.client,
};
