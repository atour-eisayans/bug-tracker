const config = require('config');
const cacheUtils = require('../../utils/cache.utils');
const formatResponse = require('../../middlewares/formatHttpResponse');
const logger = require('../../utils/logger');
const { UnprocessableError } = require('../../errors');

const cacheTtl = config.get('cache.ttl') || 300;

/**
 * @param {object | string} identifier 
 * @param {object} param1 
 * @returns 
 */
module.exports = (identifier, {
    ttl = null,
    statusCode = 200,
    forceDelete = false,
    refreshCache = false,
}) => async (req, res, next) => {
    try {
        let cacheId = null;
        if (typeof identifier === 'string') {
            cacheId = identifier;
        } else if (typeof identifier === 'object') {
            const keyPath = identifier.pathInReq;
            if (!keyPath || !Array.isArray(keyPath) || keyPath.length < 2) {
                return next(new UnprocessableError('Wrong key path'));
            }
            cacheId = `${identifier.prefix}:${req?.[keyPath[0]]?.[keyPath[1]]}`;
        } else {
            return next(new UnprocessableError('Invalid cache identifier'));
        }
        if (forceDelete || refreshCache) {
            await cacheUtils.deleteKey(cacheId);
        }
        if (forceDelete) {
            return next();
        }
        const cachedValue = await cacheUtils.readKey(cacheId);

        if (!cachedValue) {
            next();
            await cacheUtils.setKey(cacheId, res.locals.cache, ttl || cacheTtl);
        } else {
            return formatResponse(statusCode, cachedValue, res);
        }
    } catch (error) {
        logger.error(error);
    }
};
