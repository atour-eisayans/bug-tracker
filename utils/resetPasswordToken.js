const { randomBytes } = require('crypto');
const config = require('config');

const { tokenBytes, expiresIn } = config.get('resetPassword');

module.exports = {
    generate: () => {
        const token = randomBytes(tokenBytes);

        return token.toString('hex');
    },
    expire: () => new Date(Date.now() + expiresIn * 1000).toISOString(),
};
