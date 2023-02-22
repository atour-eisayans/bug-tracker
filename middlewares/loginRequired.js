const { ForbiddenError } = require('../errors');

module.exports = (req, res, next) => {
    if (!res.locals.user) {
        return next(new ForbiddenError('You must login first'));
    }

    return next();
};
