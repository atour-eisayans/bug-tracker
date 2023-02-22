const express = require('express');
const cookieParser = require('cookie-parser');
const applyHttpRoutes = require('./http.routes');
const globalErrorHandler = require('../../utils/errorHandler');
const healthCheckRoute = require('../../middlewares/health-check.http');
const requestId = require('../../middlewares/requestId');
const respondDetails = require('../../middlewares/respondDetails');
const { NotFoundError } = require('../../errors');
const { runDBs } = require('../../db');

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(healthCheckRoute);

app.use(requestId);
app.use(respondDetails);

runDBs().then(() => applyHttpRoutes(app));

app.use('**', (_, __, next) => next(new NotFoundError('Path not found')));

app.use((error, req, res, next) => {
    return globalErrorHandler(error, {
        httpResponder: res,
        httpRequestId: req.id,
        httpRequestPath: req.path,
        httpRequestMethod: req.method,
    });
});

module.exports = app;
