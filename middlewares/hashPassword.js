const { generateHash } = require('../utils/hash');

module.exports = async (req, res, next) => {
    if (req.body && req.body.password) {
        req.body.password = await generateHash(req.body.password);
    }

    return next();
};
