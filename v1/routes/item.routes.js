const { Router } = require('express');
const validateResource = require('../middlewares/validateResource');
const checkRolePermissions = require('../middlewares/checkRolePermissions');
const { item } = require('../../data/permissions');
const {
    createItemHandler,
    getItemHandler,
    listItemsHandler,
    updateItemHandler,
} = require('../controllers/item.controller');
const {
    createItemSchema,
    getItemSchema,
    listItemsSchema,
    updateItemSchema,
} = require('../validationSchemas/item.schema');
const loginRequired = require('../../middlewares/loginRequired');

const router = Router();

router.post(
    '/',
    [
        loginRequired,
        checkRolePermissions(item.add),
        validateResource(createItemSchema),
    ],
    createItemHandler
);

router.get(
    '/list',
    [
        loginRequired,
        checkRolePermissions(item.list),
        validateResource(listItemsSchema),
    ],
    listItemsHandler
);

router.get(
    '/:itemId',
    [
        loginRequired,
        checkRolePermissions(item.get),
        validateResource(getItemSchema),
    ],
    getItemHandler
);

router.patch(
    '/:itemId',
    [
        loginRequired,
        checkRolePermissions(item.update),
        validateResource(updateItemSchema),
    ],
    updateItemHandler
);

module.exports = router;
