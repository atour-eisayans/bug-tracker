const Joi = require('joi');
const { BadRequestError } = require('../../errors');

/**
 *
 * @param {[object]} errors
 */
const generateValidationErrorMessage = (errors) => {
    let msg = '';
    for (const error of errors) {
        msg += error.message + '; ';
    }

    return msg;
};

/**
 *
 * @param {Joi.AnySchema} validationSchema
 * @returns
 */
module.exports = (validationSchema) => {
    return async (req, res, next) => {
        try {
            const value = await validationSchema.validateAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            req.body = value.body;
            req.query = value.query;
            req.params = value.params;

            return next();
            
        } catch (error) {
            return next(
                new BadRequestError(
                    generateValidationErrorMessage(error.details),
                    error.details
                )
            );
        }
    };
};
