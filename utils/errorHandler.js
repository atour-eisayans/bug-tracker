const { CustomError } = require('../errors');
const logger = require('./logger');

const handleCustomError = (
    { statusCode = 500, message = '', requestId = null },
    httpResponder = null
) => {
    if (httpResponder) {
        httpResponder.status(statusCode).json({
            data: null,
            error: {
                message,
                requestId,
            },
            statusCode,
        });
    }
};

const errorHandler = (
    error,
    {
        httpResponder = null,
        httpRequestId = null,
        httpRequestPath = null,
        httpRequestMethod = '',
    }
) => {
    if (error instanceof CustomError) {
        handleCustomError(
            {
                message: error.message,
                statusCode: error.statusCode,
                requestId: httpRequestId,
            },
            httpResponder
        );
    }
    logger.error({
        error,
        requestId: httpRequestId,
        path: `${httpRequestMethod.toUpperCase()} ${httpRequestPath}`,
    });
};

module.exports = errorHandler;
