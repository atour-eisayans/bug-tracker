const { Router } = require('express');
const validateResource = require('../middlewares/validateResource');
const checkRolePermissions = require('../middlewares/checkRolePermissions');
const { request: requestPermissions } = require('../../data/permissions');
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
        checkRolePermissions(requestPermissions.listRequests),
        mustBeFromTypeOf(accountTypes.admin),
        validateResource(listRequestsSchema),
    ],
    listRequestsHandler
);

router.get(
    '/:requestId',
    [
        loginRequired,
        checkRolePermissions(requestPermissions.getRequest),
        mustBeFromTypeOf(accountTypes.admin),
        validateResource(getRequestSchema),
    ],
    getRequestHandler
);

router.patch(
    '/:requestId/approve',
    [
        loginRequired,
        checkRolePermissions(requestPermissions.approveRequest),
        mustBeFromTypeOf(accountTypes.admin),
        validateResource(approveRequestSchema),
    ],
    approveRequestHandler
);

module.exports = router;
