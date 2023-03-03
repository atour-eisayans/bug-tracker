module.exports = (
    { statusCode = 200, data = null, cacheValue = false },
    httpResponder = null
) => {
    const result = {
        statusCode,
        data,
    };
    if (cacheValue && httpResponder) {
        httpResponder.locals.cache = data;
    }
    if (httpResponder) {
        return httpResponder.status(statusCode).json(result);
    }
    return result;
};
