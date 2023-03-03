const mongoDB = require('./mongoDB/mongo.connection');
const pg = require('./pg/pg.connection');
const redis = require('./redis/redis.connection');

async function runDBs() {
    await redis.connect();
    await mongoDB.connect();
    pg.connect();
}

module.exports = {
    runDBs,
};
