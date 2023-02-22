const logger = require('../utils/logger');

module.exports = (req, res, next) => {
    const startTime = new Date();
    next();
    const logObject = {
        id: req.id,
        method: req.method,
        path: req.path,
        originalUrl: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${new Date() - startTime}ms`
    }
    logger.debug(logObject);
};
