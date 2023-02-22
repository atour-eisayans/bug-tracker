const config = require('config');

const { accounts: accountsTbl } = config.get('db.pg.tableNames');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable(accountsTbl, (table) => {
        table.string('reset_password_token', 200);
        table.datetime('reset_token_expire');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable(accountsTbl, (table) => {
        table.dropColumns('reset_password_token', 'reset_token_expire');
    });
};
