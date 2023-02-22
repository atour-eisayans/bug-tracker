const CustomError = require('./custom.error');

class BadRequestError extends CustomError {
    constructor(msg, data) {
        super(400, msg, data);
    }
}

module.exports = BadRequestError;
