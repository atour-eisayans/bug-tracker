const CustomError = require('./custom.error');

class ForbiddenError extends CustomError {
    constructor(msg, data) {
        super(403, msg, data);
    }
}

module.exports = ForbiddenError;
