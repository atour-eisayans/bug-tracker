const CustomError = require('./custom.error');

class UnprocessableError extends CustomError {
    constructor(msg, data) {
        super(422, msg, data);
    }
}

module.exports = UnprocessableError;
