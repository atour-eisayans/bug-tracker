const itemModel = require('../DALs/item.dal');
const accountTypes = require('../../data/accountTypes');
const itemTypes = require('../../data/itemTypes');
const priorities = require('../../data/priorities');
const itemStatuses = require('../../data/statusTypes');
const { NotFoundError, UnprocessableError } = require('../../errors');

const createItem = async (itemDetails) => {
    const insertObject = {
        type: itemDetails.type,
        title: itemDetails.title,
        description: itemDetails.description || null,
        priority: itemDetails.priority,
        creator: itemDetails.creator,
        assignee: itemDetails.assignee,
        status: itemDetails.status,
        due_date: itemDetails.dueDate || null,
    };
    const itemId = await itemModel.insertOne(insertObject);

    return itemId;
};

const getItemById = async (itemId) => {
    const item = await itemModel.findByIdDetails(itemId);

    if (!item) {
        throw new NotFoundError('Item was not found!');
    }

    const itemTypeTitle = Object.entries(itemTypes).find(
        ([, typeId]) => typeId === +item.type
    )?.[0];

    const itemPriorityTitle = Object.entries(priorities).find(
        ([, pId]) => pId === +item.priority
    )?.[0];

    const itemStatusTitle = Object.entries(itemStatuses).find(
        ([, statusId]) => statusId === +item.status
    )?.[0];

    if (!itemTypeTitle || !itemPriorityTitle || !itemStatusTitle) {
        throw new UnprocessableError('Type or priority or status is invalid', {
            status: item.status,
            priority: item.priority,
            type: item.type,
        });
    }

    return {
        id: item.id,
        type: item.type,
        typeTitle: itemTypeTitle,
        title: item.title,
        description: item.description,
        priority: item.priority,
        priorityTitle: itemPriorityTitle,
        creatorId: item.creator_id,
        creatorName: item.creator_name,
        creatorEmail: item.creator_email,
        assigneeId: item.assignee_id,
        assigneeName: item.assignee_name,
        assigneeEmail: item.assignee_email,
        status: item.status,
        statusTitle: itemStatusTitle,
        dueDate: item.due_date,
        createdAt: item.created_at,
    };
};

const getItems = async (account, query = {}) => {
    const { limit = 10, page = 1 } = query;
    const offset = (page - 1) * limit;
    const items =
        account.type === accountTypes.employee
            ? await itemModel.findCompanyItems(account.parent, { limit, offset })
            : await itemModel.findCompanyItems(account.id, { limit, offset });

    return items;
};

const findAndUpdateItem = async (itemId, itemDetails) => {
    const item = await itemModel.findById(itemId);

    if (!item) {
        throw new NotFoundError('Item not found');
    }

    const itemEntity = {
        ...item,
        ...itemDetails,
    };

    const updatedItem = await itemModel.update(itemId, itemEntity);

    return {
        id: updatedItem.id,
    };
};

module.exports = {
    createItem,
    getItemById,
    getItems,
    findAndUpdateItem,
};
