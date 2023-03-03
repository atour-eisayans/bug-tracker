const redisClient = require('../db/redis/redis.client');

class CacheHandler {
    constructor() {
        this.redisClient = redisClient;
    }

    async deleteKey(key) {
        await this.redisClient.deleteValue(key);
        return true;
    }

    async readKey(key) {
        const value = await this.redisClient.getValue(key);
        return value;
    }

    async setKey(key, value, ttl = null) {
        await this.redisClient.setValue(key, value, ttl);
        return true;
    }
}

module.exports = new CacheHandler();
