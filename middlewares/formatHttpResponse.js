module.exports = (statusCode, data, httpResponder = null) => {
    const result = {
        statusCode,
        data,
    };
    if (httpResponder) {
        return httpResponder.status(statusCode).json(result);
    }
    return result;
};
