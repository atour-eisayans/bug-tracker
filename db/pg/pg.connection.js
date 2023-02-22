const knexBuilder = require('knex');
const pgConfig = require('../../config/knexfile');

const knex = knexBuilder(pgConfig);

module.exports = knex;
