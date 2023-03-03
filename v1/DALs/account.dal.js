const config = require('config');
const pgClient = require('../../db/pg/pg.client');
const { DatabaseError } = require('../../errors');
const logger = require('../../utils/logger');

const { accounts: accountsTbl = null, roles: rolesTbl = null } =
    config.get('db.pg.tableNames');

if (!accountsTbl) throw new Error('something bad happened!');
if (!rolesTbl) throw new Error('something bad happened!');

const insertOne = async ({ email, password, role, type }) => {
    try {
        const [account = null] = await pgClient
            .insert({
                email,
                password,
                role,
                type,
            })
            .into(accountsTbl)
            .returning(['id', 'email', 'role']);
        return account;
    } catch (error) {
        throw new DatabaseError('Failed saving data in db', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findByEmail = async (email) => {
    try {
        const [account = null] = await pgClient
            .select('id', 'email', 'role', 'password', 'type')
            .from(accountsTbl)
            .where('email', email);

        return account;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findById = async (accountId) => {
    try {
        console.log('pgClient: ', pgClient)
        const [account = null] = await pgClient
            .select('id', 'email', 'role', 'type', 'parent', 'password')
            .from(accountsTbl)
            .where('id', accountId)
            .andWhere('enabled', true);

        return account;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const findByIdWithPermissions = async (accountId) => {
    try {
        const [account = null] = await pgClient
            .select(
                `${accountsTbl}.id`,
                `${accountsTbl}.email`,
                `${accountsTbl}.role`,
                `${accountsTbl}.type`,
                `${rolesTbl}.permissions`
            )
            .from(accountsTbl)
            .innerJoin(rolesTbl, `${accountsTbl}.role`, `${rolesTbl}.id`)
            .where(`${accountsTbl}.id`, accountId)
            .andWhere(`${accountsTbl}.enabled`, true);

        return account;
    } catch (error) {
        throw new DatabaseError('Failed fetching data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const updateLastLogin = async (accountId) => {
    try {
        await pgClient(accountsTbl)
            .where('id', accountId)
            .update('last_login', new Date().toISOString());
    } catch (error) {
        throw new DatabaseError('Failed updating data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const resetPassword = async (token, password) => {
    try {
        const [account = null] = await pgClient(accountsTbl)
            .whereRaw(
                'reset_password_token = ? AND reset_token_expire > now() AND enabled = true',
                [token]
            )
            .update({
                password,
                reset_password_token: null,
                reset_token_expire: null,
            })
            .returning(['id', 'password']);

        return account;
    } catch (error) {
        throw new DatabaseError('Failed updating data', {
            stack: error.stack,
            message: error.message,
            detail: error.detail,
        });
    }
};

const setResetToken = async (email, token, expire) => {
    try {
        const [account = null] = await pgClient(accountsTbl)
            .where('email', email)
            .andWhere('enabled', true)
            .update({
                reset_password_token: token,
                reset_token_expire: expire,
            })
            .returning('reset_password_token as token');

        return account;
    } catch (error) {
        logger.error({
            error,
            details: 'Failed setting reset token',
        });
    }
};

module.exports = {
    insertOne,
    findByEmail,
    updateLastLogin,
    findById,
    findByIdWithPermissions,
    setResetToken,
    resetPassword,
};
