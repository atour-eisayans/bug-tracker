console.log(process.env)
const config = require('config');
const httpServer = require('./servers/http/http.server');
const { runDBs } = require('./db');

const port = config.get('port');

runDBs().then(() => {
    httpServer.listen(port, () => console.log(`server is running on: ${port}`));
});
