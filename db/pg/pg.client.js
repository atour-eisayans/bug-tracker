const pg = require('./pg.connection');

if (!pg.connection) {
    pg.connect();
}

module.exports = pg.connection;
