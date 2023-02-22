const CustomError = require('./custom.error');

class DatabaseError extends CustomError {
    constructor(msg, data) {
        super(409, msg, data);
    }
}

module.exports = DatabaseError;
