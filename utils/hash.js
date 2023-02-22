const bcrypt = require('bcrypt');
const config = require('config');
const { CustomError } = require('../errors');

module.exports = {
    generateHash: async (password) => {
        try {
            const hashSaltRounds =
                (config.get('hashSaltRounds') && +config.get('hashSaltRounds')) ||
                10;
            const salt = await bcrypt.genSalt(hashSaltRounds);
            const hash = await bcrypt.hash(password, salt);
    
            return hash.toString();
        } catch (error) {
            throw new CustomError(500, 'something wrong while hashing', {
                stack: error.stack,
                message: error.message,
            });
        }
    },
    compareHash: async (password, hashedPassword) => {
        const result = await bcrypt.compare(password, hashedPassword);
        return result;
    }
}
