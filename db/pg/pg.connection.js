const knexBuilder = require('knex');
const pgConfig = require('../../config/knexfile');

const knex = {
    connect() {
        this.connection = knexBuilder(pgConfig);
    },
    disconnect() {
        this.connection = null;
    },
    connection: null,
};

module.exports = knex;
