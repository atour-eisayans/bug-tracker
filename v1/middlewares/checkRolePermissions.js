const { ForbiddenError, UnprocessableError } = require('../../errors');
const { findAccountAndPermissions } = require('../services/account.service');

module.exports = (rule) => async (req, res, next) => {
    if (!rule) {
        throw new UnprocessableError('Rule is not defined;')
    }
    const { id: accountId } = res.locals.user;
    const account = await findAccountAndPermissions(accountId); // { permissions = null }
    if (!account.permissions) {
        return next(new ForbiddenError());
    }
    const [category] = rule.toLowerCase().split('/');
    const isAllowed = account.permissions.some(
        (permission) => {
            const p = permission.toLowerCase();
            return p === `${category}/*` || p === rule;
        }
    );

    return isAllowed ? next() : next(new ForbiddenError('You do not have required permissions'));
};
