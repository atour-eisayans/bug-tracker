const config = require('config');
const pgClient = require('../../db/pg/pg.client');
const { DatabaseError } = require('../../errors');

const { roles: rolesTbl = null } = config.get('db.pg.tableNames');

if (!rolesTbl) throw new Error('something bad happened!');

const findById = async (roleId) => {
    try {
        const [role = null] = await pgClient
            .select('id', 'permissions', 'title')
            .from(rolesTbl)
            .where('id', roleId);

        return role;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findByType = async (roleType) => {
    try {
        const [role = null] = await pgClient
            .select('id', 'permissions', 'title')
            .from(rolesTbl)
            .where('type', roleType);

        return role;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

module.exports = {
    findById,
    findByType,
};
