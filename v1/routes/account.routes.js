const { Router } = require('express');
const validateResource = require('../middlewares/validateResource');
const checkRolePermissions = require('../middlewares/checkRolePermissions');
const { account: accountsPermissions } = require('../../data/permissions');
const {
    createAccountHandler,
    simpleLoginHandler,
    forgetPasswordHandler,
    resetPasswordHandler,
} = require('../controllers/account.controller');
const {
    createAccountSchema,
    simpleLoginSchema,
    resetPasswordSchema,
    forgetPasswordSchema,
} = require('../validationSchemas/account.schema');
const loginRequired = require('../../middlewares/loginRequired');
const mustBeFromTypeOf = require('../middlewares/mustBeFromTypeOf');
const accountTypes = require('../../data/accountTypes');

const router = Router();

router.post(
    '/',
    [
        loginRequired,
        checkRolePermissions(accountsPermissions.create),
        mustBeFromTypeOf(accountTypes.admin, accountTypes.company),
        validateResource(createAccountSchema),
    ],
    createAccountHandler
);

router.post('/login', validateResource(simpleLoginSchema), simpleLoginHandler);

router.patch(
    '/forget-password',
    validateResource(forgetPasswordSchema),
    forgetPasswordHandler
);

router.patch(
    '/reset-password',
    validateResource(resetPasswordSchema),
    resetPasswordHandler
);

module.exports = router;
