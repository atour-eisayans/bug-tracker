class CustomError extends Error {
    constructor(statusCode, msg, data) {
        super(msg);
        this.statusCode = statusCode;
        this.data = data;
    }
}

module.exports = CustomError;
