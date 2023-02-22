const {
    createAccount,
    validateLoginDetails,
    issueAccessToken,
    issueRefreshToken,
    setResetPasswordToken,
    resetPasswordByToken,
} = require('../services/account.service');
const formatResponse = require('../../middlewares/formatHttpResponse');

const createAccountHandler = async (req, res, next) => {
    try {
        const { body: accountDetails } = req;
        const account = await createAccount(accountDetails);

        return formatResponse(
            201,
            {
                id: account.id,
            },
            res
        );
    } catch (error) {
        return next(error);
    }
};

const simpleLoginHandler = async (req, res, next) => {
    try {
        const { body: accountDetails } = req;
        const account = await validateLoginDetails({
            email: accountDetails.email,
            password: accountDetails.password,
        });

        const accessToken = await issueAccessToken({ id: account.id });
        const refreshToken = await issueRefreshToken({ id: account.id });

        return formatResponse(
            200,
            {
                accessToken,
                refreshToken,
            },
            res
        );
    } catch (error) {
        return next(error);
    }
};

const forgetPasswordHandler = async (req, res, next) => {
    try {
        const { email } = req.body;
        const resetToken = await setResetPasswordToken(email);

        return formatResponse(200, { resetToken }, res);
    } catch (error) {
        return next(error);
    }
};

const resetPasswordHandler = async (req, res, next) => {
    try {
        const { resetToken } = req.query;
        const { newPassword } = req.body;

        await resetPasswordByToken(resetToken, newPassword);

        return formatResponse(204, null, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createAccountHandler,
    simpleLoginHandler,
    resetPasswordHandler,
    forgetPasswordHandler,
};
