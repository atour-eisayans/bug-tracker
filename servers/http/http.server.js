const http = require('http');

const app = require('./http.app');

const httpServer = http.createServer(app);

module.exports = httpServer;
