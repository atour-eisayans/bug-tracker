const config = require('config');

const { host, username, password, port, dbName } = config.get('db.pg');

if (!host || !username || !password || !port || !dbName) {
    throw new Error('something very bad happened!!!');
}

module.exports = {
    client: 'pg',
    connection: {
        host,
        database: dbName,
        user: username,
        password,
        port,
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'knex_migrations',
    },
};
