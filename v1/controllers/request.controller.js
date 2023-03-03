const {
    createRequest,
    listRequests,
    getRequestById,
    approveRequest,
} = require('../services/request.service');
const formatResponse = require('../../middlewares/formatHttpResponse');
const {
    createAccount,
    createCompanyEntity,
} = require('../services/account.service');

const createRequestHandler = async (req, res, next) => {
    try {
        const { body: requestDetails } = req;
        const request = await createRequest(requestDetails);

        return formatResponse(
            {
                data: request,
                statusCode: 201,
            },
            res
        );
    } catch (error) {
        return next(error);
    }
};

const listRequestsHandler = async (req, res, next) => {
    try {
        const { query } = req;
        const requests = await listRequests(query);

        return formatResponse(
            {
                data: requests,
                statusCode: 200,
            },
            res
        );
    } catch (error) {
        return next(error);
    }
};

const getRequestHandler = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const request = await getRequestById(requestId);

        return formatResponse(
            {
                data: request,
                statusCode: 200,
            },
            res
        );
    } catch (error) {
        return next(error);
    }
};

const approveRequestHandler = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const { email } = await approveRequest(requestId);
        const accountEntity = await createCompanyEntity({
            email,
            password: '123456',
        });
        const account = await createAccount(accountEntity, true);

        return formatResponse({
            data: { id: account.id },
            statusCode: 201,
        }, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createRequestHandler,
    listRequestsHandler,
    getRequestHandler,
    approveRequestHandler,
};
