const { client } = require('./redis.connection');
const { UnprocessableError } = require('../../errors');

const wrapper = async (callback) => {
    try {
        const result = await callback();

        return result;
    } catch (error) {
        throw new UnprocessableError('Failed processing data in redis', {
            stack: error.stack,
            message: error.message,
        });
    }
};

class RedisClient {
    async setValue(key, value, ttl = null) {
        return wrapper(async () => {
            const options = {};

            if (ttl && !isNaN(ttl)) {
                options.EX = ttl;
            }

            const valueToStore =
                typeof value === 'object' ? JSON.stringify(value) : value;
            const res = await client.set(key, valueToStore, options);
            return res;
        });
    }

    deleteValue(key) {
        return wrapper(async () => {
            const res = await client.del(key);
            return res;
        });
    }

    getValue(key) {
        return wrapper(async () => {
            const value = await client.get(key);
            try {
                const object = JSON.parse(value);
                return object;
            } catch {
                return value;
            }
        });
    }
}

module.exports = new RedisClient();
