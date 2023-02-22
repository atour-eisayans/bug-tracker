const mongoDB = require('./mongoDB/mongo.connection');
const pg = require('./pg/pg.connection');

async function runDBs() {
    await mongoDB.connect();
    // pg already has been started
}

module.exports = {
    runDBs,
    mongoDB,
    pg,
};
