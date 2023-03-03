const config = require('config');
const pgClient = require('../../db/pg/pg.client');
const { DatabaseError } = require('../../errors');

const { accounts: accountsTbl = null, requests: requestsTbl = null } =
    config.get('db.pg.tableNames');

if (!accountsTbl) throw new Error('something bad happened!');
if (!requestsTbl) throw new Error('something bad happened!');

const findByEmail = async (email) => {
    try {
        const [request = null] = await pgClient
            .select('id')
            .from(requestsTbl)
            .where('email', email);

        return request;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const insertOne = async ({ name, email }) => {
    try {
        const [request = null] = await pgClient
            .insert({
                name,
                email,
            })
            .into(requestsTbl)
            .returning('id');

        return request;
    } catch (error) {
        throw new DatabaseError('Failed saving data in db', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findAll = async ({ offset, limit }) => {
    try {
        const requests = await pgClient
            .select('id', 'name', 'email', 'created_at')
            .from(requestsTbl)
            .orderBy('created_at', 'asc')
            .limit(limit)
            .offset(offset);

        return requests;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findUnapproved = async ({ offset, limit }) => {
    try {
        const requests = await pgClient
            .select('id', 'name', 'email', 'created_at')
            .from(requestsTbl)
            .where('approved', false)
            .orderBy('created_at', 'asc')
            .limit(limit)
            .offset(offset);

        return requests;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findApproved = async ({ offset, limit }) => {
    try {
        const requests = await pgClient
            .select('id', 'name', 'email', 'created_at')
            .from(requestsTbl)
            .where('approved', true)
            .orderBy('created_at', 'asc')
            .limit(limit)
            .offset(offset);

        return requests;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findById = async (requestId) => {
    try {
        const [request = null] = await pgClient
            .select('*')
            .from(requestsTbl)
            .where('id', requestId);

        return request;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const approve = async (requestId) => {
    try {
        const [request = null] = await pgClient(requestsTbl)
            .where('id', requestId)
            .andWhere('approved', false)
            .update({
                approved: true,
                confirmation_date: new Date(),
            })
            .returning(['id', 'email']);

        return request;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

module.exports = {
    findByEmail,
    insertOne,
    findAll,
    findUnapproved,
    findApproved,
    findById,
    approve,
};
