const config = require('config');
const httpServer = require('./servers/http/http.server');

const port = config.get('port');

httpServer.listen(port, () => console.log(`server is running on: ${port}`));
