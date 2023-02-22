const config = require('config');
const { generateHash } = require('../../../utils/hash');

const accountTypes = require('../../../data/accountTypes');

const {
    tableNames: {
        accounts: accountsTbl,
        roles: rolesTbl,
        items: itemsTbl,
        requests: requestsTbl,
    },
    initialAccount,
    initialRoles,
} = config.get('db.pg');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable(rolesTbl, (table) => {
            table.increments('id', { primaryKey: true });
            table.string('title').unique();
            table.json('permissions');
            table.integer('type'); // it refers to the types id
            table.timestamps(true, true, false);
        })
        .createTable(accountsTbl, (table) => {
            table.increments('id', { primaryKey: true });
            table.string('name', 50);
            table.string('email', 255).notNullable().unique();
            table.string('password').notNullable();
            table.integer('role').notNullable();
            table.integer('parent');
            table.smallint('type').notNullable();
            table.datetime('last_login');
            table.boolean('enabled').defaultTo(true);
            table.timestamps(true, true, false);

            table.foreign('role').references('id').inTable('roles');
        })
        .createTable(itemsTbl, (table) => {
            table.increments('id', { primaryKey: true });
            table.smallint('type').notNullable();
            table.string('title').notNullable();
            table.string('description');
            table.integer('priority').notNullable();
            table.integer('creator').notNullable();
            table.integer('assignee').notNullable();
            table.integer('status').notNullable();
            table.datetime('due_date');
            table.timestamps(true, true, false);

            table.foreign('creator').references('id').inTable(accountsTbl);
        })
        .createTable(requestsTbl, (table) => {
            table.increments('id', { primaryKey: true });
            table.string('name', 100);
            table.string('email', 255).notNullable().unique();
            table.boolean('approved').defaultTo(false);
            table.datetime('confirmation_date');
            table.timestamps(true, true, false);
        })
        .then(() => {
            return knex.insert({
                title: initialRoles.company.title,
                permissions: JSON.stringify(
                    initialRoles.company.permissions
                ),
                type: initialRoles.company.type
            })
            .into(rolesTbl);
        })
        .then(() => {
            return console.log('successfully saved company role');
        })
        .catch(error => {
            console.log('failed storing company role');
            console.error(error);
        })
        .then(() => {
            return knex.insert({
                title: initialRoles.employee.title,
                permissions: JSON.stringify(
                    initialRoles.employee.permissions
                ),
                type: initialRoles.employee.type
            })
            .into(rolesTbl);
        })
        .then(() => {
            return console.log('successfully saved employee role');
        })
        .catch(error => {
            console.log('failed storing employee role');
            console.error(error);
        })
        .then(() => {
            return knex.insert({
                title: initialRoles.admin.title,
                permissions: JSON.stringify(
                    initialRoles.admin.permissions
                ),
                type: initialRoles.admin.type
            })
            .into(rolesTbl)
            .returning('id');
        })
        .then(([adminRole]) => {
            return generateHash(
                initialAccount.password
            ).then((hashedPassword) => {
                return Promise.resolve({
                    roleId: adminRole.id,
                    password: hashedPassword,
                });
            }).catch(err => {
                console.log('failed hashing admin password');
                console.error(err);
                return Promise.reject(err);
            });
        })
        .then((adminData) => {
            return knex.insert({
                name: initialAccount.name,
                password: adminData.password,
                role: adminData.roleId,
                type: accountTypes.admin,
                email: initialAccount.email,
            })
            .into(accountsTbl);
        })
        .catch(error => {
            console.log('failed storing admin\'s data');
            console.error(error);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists(rolesTbl)
        .dropTableIfExists(accountsTbl)
        .dropTableIfExists(itemsTbl);
};
