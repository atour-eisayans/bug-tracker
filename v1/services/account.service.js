const config = require('config');
const { compareHash } = require('../../utils/hash');
const accountModel = require('../DALs/account.dal');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
} = require('../../errors');
const { generateHash } = require('../../utils/hash');
const { signJwt, verifyJwt } = require('../../utils/jwt');
const resetPasswordToken = require('../../utils/resetPasswordToken');
const { getRoleByType } = require('./role.service');

const tokensConfig = config.get('jwt');

const createAccount = async (accountDetails, doHashPassword = false) => {
    const accountEntity = {
        email: accountDetails.email,
        password: accountDetails.password,
        role: accountDetails.role,
        type: accountDetails.type,
    };
    if (doHashPassword) {
        accountEntity.password = await generateHash(accountEntity.password);
    }
    const account = await accountModel.insertOne(accountEntity);

    return {
        id: account.id,
        email: account.email,
        role: account.role,
    };
};

const createCompanyEntity = async ({ email, password }) => {
    const companyRole = await getRoleByType(accountTypes.company);
    const accountToBeCreated = {
        email,
        password,
        role: companyRole.id,
        type: accountTypes.company,
    };
    return accountToBeCreated;
}

const findAccountById = async (accountId) => {
    const account = await accountModel.findById(accountId);

    if (!account) {
        throw new NotFoundError('Account not found');
    }

    return {
        id: account.id,
        email: account.email,
        role: account.role,
        type: account.type,
        parent: account.parent,
    };
};

const emailExistsInAccounts = async (email) => {
    const account = await accountModel.findByEmail(email);

    return !!account;
};

const findAccountAndPermissions = async (accountId) => {
    const account = await accountModel.findByIdWithPermissions(accountId);

    if (!account) {
        throw new NotFoundError('Account not found');
    }

    return {
        id: account.id,
        email: account.email,
        role: account.role,
        type: account.type,
        permissions: account.permissions,
    };
};

const validateLoginDetails = async (accountDetails) => {
    const { email, password } = accountDetails;

    const account = await accountModel.findByEmail(email);

    if (!account) {
        throw new BadRequestError('Invalid email or password');
    }

    const passwordIsValid = await compareHash(password, account.password);

    if (!passwordIsValid) {
        throw new BadRequestError('Invalid email or password');
    }

    await accountModel.updateLastLogin(account.id);

    return { id: account.id };
};

const issueAccessToken = async (accountDetails) => {
    const { id } = accountDetails;
    const tokenTtl = `${tokensConfig.accessToken.ttl || 900}s`;
    const accessToken = await signJwt({ id }, tokenTtl);

    return accessToken;
};

const reissueAccessToken = async (refreshToken) => {
    const { decoded: accountDetails, expired } = verifyJwt(refreshToken);
    if (expired) {
        throw new ForbiddenError('Refresh token is expired');
    }

    if (!accountDetails) {
        throw new BadRequestError('Refresh token is invalid');
    }
    const { id: accountId } = accountDetails;
    const account = await accountModel.findById(accountId);

    if (!account) {
        throw new BadRequestError('Refresh token is invalid');
    }

    const accountEntity = {
        id: account.id,
        email: account.email,
        role: account.role,
        type: account.type,
        parent: account.parent,
    };

    const tokenTtl = `${tokensConfig.accessToken.ttl || 900}s`;
    const accessToken = await signJwt({ id: accountId }, tokenTtl);

    return {
        accessToken,
        account: accountEntity,
    };
};

const issueRefreshToken = async (accountDetails) => {
    const { id } = accountDetails;
    const tokenTtl = `${tokensConfig.refreshToken.ttl || 86400}s`;
    const refreshToken = await signJwt({ id }, tokenTtl);

    return refreshToken;
};

const setResetPasswordToken = async (email) => {
    const token = resetPasswordToken.generate();
    const expire = resetPasswordToken.expire();

    const { token: resetToken = null } = await accountModel.setResetToken(email, token, expire);
    return resetToken;
};

const resetPasswordByToken = async (token, newPassword) => {
    await accountModel.resetPassword(token, newPassword);
}

module.exports = {
    createAccount,
    validateLoginDetails,
    issueAccessToken,
    reissueAccessToken,
    issueRefreshToken,
    findAccountById,
    findAccountAndPermissions,
    emailExistsInAccounts,
    setResetPasswordToken,
    resetPasswordByToken,
    createCompanyEntity,
};
