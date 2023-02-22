const CustomError = require('./custom.error');

class NotFoundError extends CustomError {
    constructor(msg, data) {
        super(404, msg, data);
    }
}

module.exports = NotFoundError;
