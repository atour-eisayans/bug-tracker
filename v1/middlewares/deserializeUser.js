const config = require('config');
const { verifyJwt } = require('../../utils/jwt');
const {
    reissueAccessToken,
    findAccountById,
} = require('../services/account.service');

const deserializeUser = async (req, res, next) => {
    try {
        const accessToken =
            req.cookies?.['accessToken'] ||
            (req.get('authorization') || '').replace(/^Bearer\s/, '');

        if (!accessToken) return next();

        const refreshToken =
            req.cookies?.['refreshToken'] || req.get('x-refresh');

        const { decoded, expired } = verifyJwt(accessToken);

        if (decoded) {
            const account = await findAccountById(decoded.id);
            res.locals.user = account;
            return next();
        }

        if (expired && refreshToken) {
            const { accessToken: newAccessToken = null, account } =
                await reissueAccessToken(refreshToken);

            if (newAccessToken) {
                res.setHeader('x-access-token', newAccessToken);
                const accessTokenTtl =
                    (config.get('jwt.accessToken.ttl') || 900) * 1000;
                res.cookie('accessToken', newAccessToken, {
                    maxAge: accessTokenTtl,
                    secure: false,
                    httpOnly: true,
                    path: '/',
                    sameSite: 'lax',
                });

                res.locals.user = account;
            }
        }

        return next();
    } catch (error) {
        return next(error);
    }
};

module.exports = deserializeUser;
