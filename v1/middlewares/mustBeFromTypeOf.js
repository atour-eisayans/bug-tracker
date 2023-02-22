const { ForbiddenError } = require('../../errors');

module.exports =
    (...fromTypeOf) =>
    (req, res, next) => {
        if (!res.locals.user) {
            return next(new ForbiddenError('Login is required'));
        }

        const { type = null } = res.locals.user;

        if (!type) {
            return next(new ForbiddenError('Please login again'));
        }

        const isValid = fromTypeOf.indexOf(type) >= 0;

        if (!isValid) {
            return next(
                new ForbiddenError('Account type mismatches', {
                    type,
                    mustBe: fromTypeOf,
                })
            );
        }

        next();
    };
