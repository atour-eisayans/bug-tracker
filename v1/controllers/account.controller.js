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
            {
                data: {
                    id: account.id,
                },
                statusCode: 201,
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
            {
                data: accessToken,
                statusCode: 200,
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

        return formatResponse(
            {
                data: { resetToken },
                statusCode: 200,
            },
            res
        );
    } catch (error) {
        return next(error);
    }
};

const resetPasswordHandler = async (req, res, next) => {
    try {
        const { resetToken } = req.query;
        const { newPassword } = req.body;

        await resetPasswordByToken(resetToken, newPassword);

        return formatResponse(
            {
                statusCode: 204,
            },
            res
        );
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
