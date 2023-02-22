const jwt = require('jsonwebtoken');
const config = require('config');
const { NotFoundError } = require('../errors');

const { secret: jwtSecret, defaultTtl } = config.get('jwt');

if (!jwtSecret) {
    throw new NotFoundError('jwt config not found');
}



const signJwt = async (payload, expiresIn = `${defaultTtl}s`) => {
    return jwt.sign(payload, jwtSecret, {
        expiresIn,
    });
};

const verifyJwt = (token) => {
    try {
        const decoded = jwt.verify(token, jwtSecret);
        return {
            decoded,
            expired: false,
        };
    } catch (error) {
        return {
            decoded: null,
            expired: error.message === 'jwt expired',
        };
    }
};

module.exports = {
    signJwt,
    verifyJwt,
};
