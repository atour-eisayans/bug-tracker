const {
    createItem,
    getItemById,
    getItems,
    findAndUpdateItem,
} = require('../services/item.service');
const formatResponse = require('../../middlewares/formatHttpResponse');

const createItemHandler = async (req, res, next) => {
    try {
        const { body: itemDetails } = req;

        const creatorAccount = res.locals.user;
        itemDetails.creator = creatorAccount.id;

        const item = await createItem(itemDetails);

        return formatResponse(201, item, res);
    } catch (error) {
        return next(error);
    }
};

const listItemsHandler = async (req, res, next) => {
    try {
        const account = res.locals.user;
        const { query } = req;
        const items = await getItems(account, query);

        return formatResponse(200, items, res);
    } catch (error) {
        return next(error);
    }
};

const getItemHandler = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const item = await getItemById(itemId);

        return formatResponse(200, item, res);
    } catch (error) {
        return next(error);
    }
};

const updateItemHandler = async (req, res, next) => {
    try {
        const { body: itemDetails } = req;
        const { itemId } = req.params;
        const updatedItem = await findAndUpdateItem(itemId, itemDetails);

        return formatResponse(200, updatedItem, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createItemHandler,
    listItemsHandler,
    getItemHandler,
    updateItemHandler,
};
