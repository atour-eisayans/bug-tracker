const { Router } = require('express');
const validateResource = require('../middlewares/validateResource');
const checkRolePermissions = require('../middlewares/checkRolePermissions');
const { account: accountsPermissions } = require('../../data/permissions');
const {
    createRequestHandler,
    approveRequestHandler,
    getRequestHandler,
    listRequestsHandler,
} = require('../controllers/request.controller');
const {
    createRequestSchema,
    getRequestSchema,
    approveRequestSchema,
    listRequestsSchema,
} = require('../validationSchemas/request.schema');
const loginRequired = require('../../middlewares/loginRequired');
const mustBeFromTypeOf = require('../middlewares/mustBeFromTypeOf');
const accountTypes = require('../../data/accountTypes');

const router = Router();

router.post('/', validateResource(createRequestSchema), createRequestHandler);

router.get(
    '/list',
    [
        loginRequired,
        checkRolePermissions(accountsPermissions.listRequests),
        mustBeFromTypeOf(accountTypes.admin),
        validateResource(listRequestsSchema),
    ],
    listRequestsHandler
);

router.get(
    '/:requestId',
    [
        loginRequired,
        checkRolePermissions(accountsPermissions.getRequest),
        mustBeFromTypeOf(accountTypes.admin),
        validateResource(getRequestSchema),
    ],
    getRequestHandler
);

router.post(
    '/:requestId/approve',
    [
        loginRequired,
        checkRolePermissions(accountsPermissions.approveRequest),
        mustBeFromTypeOf(accountTypes.admin),
        validateResource(approveRequestSchema),
    ],
    approveRequestHandler
);

module.exports = router;
