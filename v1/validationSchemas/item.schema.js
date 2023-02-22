const Joi = require('joi');

const itemTypes = require('../../data/itemTypes');
const itemTypesId = Object.values(itemTypes);

const priorities = require('../../data/priorities');
const prioritiesId = Object.values(priorities);

const statuses = require('../../data/statusTypes');
const statusesId = Object.values(statuses);

const createItemSchema = Joi.object({
    body: Joi.object({
        type: Joi.number()
            .integer()
            .default(itemTypes.bug)
            .valid(...itemTypesId),
        title: Joi.string().required(),
        description: Joi.string().default(null),
        priority: Joi.number()
            .integer()
            .default(priorities.must)
            .valid(...prioritiesId),
        assignee: Joi.number().required(),
        status: Joi.number()
            .default(statuses.toDo)
            .valid(...statusesId),
        dueDate: Joi.date().default(null),
    }),
    query: Joi.optional(),
    params: Joi.optional(),
});

const getItemSchema = Joi.object({
    body: Joi.optional(),
    query: Joi.optional(),
    params: Joi.object({
        itemId: Joi.number().required(),
    }),
});

const listItemsSchema = Joi.object({
    body: Joi.optional(),
    params: Joi.optional(),
    query: Joi.object({
        page: Joi.number().positive().optional().default(1),
        limit: Joi.number().positive().optional().default(10),
    }),
});

const updateItemSchema = Joi.object({
    body: Joi.object({
        type: Joi.number()
            .integer()
            .valid(...itemTypesId)
            .optional(),
        title: Joi.string().optional(),
        description: Joi.string().default(null).optional(),
        priority: Joi.number()
            .integer()
            .valid(...prioritiesId)
            .optional(),
        assignee: Joi.number().optional(),
        status: Joi.number()
            .valid(...statusesId)
            .optional(),
        dueDate: Joi.date().optional(),
    }),
    query: Joi.optional(),
    params: Joi.optional(),
});

module.exports = {
    createItemSchema,
    getItemSchema,
    listItemsSchema,
    updateItemSchema,
};
