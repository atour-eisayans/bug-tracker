const CustomError = require('./custom.error');
const DatabaseError = require('./database.error');
const NotFoundError = require('./notFound.error');
const ForbiddenError = require('./forbidden.error');
const BadRequestError = require('./badRequest.error');
const ConflictError = require('./conflict.error');
const UnprocessableError = require('./unProcessable.error');

module.exports = {
    CustomError,
    DatabaseError,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
    ConflictError,
    UnprocessableError
};
