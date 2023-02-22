const Joi = require('joi');
const { generateHash } = require('../../utils/hash');

const accountTypes = require('../../data/accountTypes');
const accountTypesId = Object.values(accountTypes);

const createRequestSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().optional().max(100),
        email: Joi.string().required().email(),
    }),
    query: Joi.optional(),
    params: Joi.optional(),
});

const getRequestSchema = Joi.object({
    body: Joi.optional(),
    query: Joi.optional(),
    params: Joi.object({
        requestId: Joi.number().required(),
    }),
});

const listRequestsSchema = Joi.object({
    body: Joi.optional(),
    params: Joi.optional(),
    query: Joi.object({
        page: Joi.number().positive().optional().default(1),
        limit: Joi.number().positive().optional().default(10),
        approved: Joi.string()
            .default('all')
            .valid('approved', 'unapproved', 'all'),
    }),
});

const approveRequestSchema = Joi.object({
    body: Joi.optional(),
    query: Joi.optional(),
    params: Joi.object({
        requestId: Joi.number().required(),
    }),
});

module.exports = {
    createRequestSchema,
    getRequestSchema,
    approveRequestSchema,
    listRequestsSchema,
};
