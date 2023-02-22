const { v4: generateId } = require('uuid');

module.exports = (req, res, next) => {
    req.id = generateId();
    return next();
};
