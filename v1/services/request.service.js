const requestModel = require('../DALs/request.dal');
const {
    BadRequestError,
    NotFoundError,
    ConflictError,
} = require('../../errors');
const {
    emailExistsInAccounts,
    createAccount,
} = require('./account.service');
const { getRoleByType } = require('./role.service');
const accountTypes = require('../../data/accountTypes');

const emailExistsInRequests = async (email) => {
    const request = await requestModel.findByEmail(email);

    return !!request;
};

const createRequest = async (requestDetails) => {
    const { email, name = null } = requestDetails;
    const emailIsUnique =
        !(await emailExistsInRequests(email)) &&
        !(await emailExistsInAccounts(email));

    if (!emailIsUnique) {
        throw new ConflictError('Email is wrong');
    }

    const request = await requestModel.insertOne({
        name,
        email,
    });

    if (!request) {
        throw new BadRequestError("I don't know why it did not get stored!");
    }

    return {
        id: request.id,
    };
};

const listRequests = async (queryOptions) => {
    const { limit = 10, page = 1, approved } = queryOptions;
    const offset = (page - 1) * limit;

    const query = { limit, offset };

    const requests =
        approved === 'all'
            ? await requestModel.findAll(query)
            : approved === 'approved'
            ? await requestModel.findApproved(query)
            : await requestModel.findUnapproved(query);

    return requests;
};

const getRequestById = async (requestId) => {
    const request = await requestModel.findById(requestId);

    if (!request) {
        throw new NotFoundError('Request id is wrong');
    }

    return request;
};

const approveRequest = async (requestId) => {
    const approved = await requestModel.approve(requestId);

    if (!approved) {
        throw new NotFoundError('Request id is wrong');
    }

    return {
        email: approved.email,
    };
};

module.exports = {
    createRequest,
    listRequests,
    getRequestById,
    approveRequest,
};
