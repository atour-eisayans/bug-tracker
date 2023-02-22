const CustomError = require('./custom.error');

class ConflictError extends CustomError {
    constructor(msg, data) {
        super(409, msg, data);
    }
}

module.exports = ConflictError;
