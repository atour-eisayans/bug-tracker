const Joi = require('joi');
const { generateHash } = require('../../utils/hash');

const accountTypes = require('../../data/accountTypes');
const accountTypesId = Object.values(accountTypes);

const createAccountSchema = Joi.object({
    body: Joi.object({
        password: Joi.string()
            .required()
            .external(async (value) => {
                try {
                    const hashedPassword = await generateHash(value);
                    return hashedPassword;
                } catch (error) {
                    throw error;
                }
            }),
        email: Joi.string().email().required(),
        role: Joi.number().required(),
        type: Joi.number()
            .default(accountTypes.employee)
            .valid(...accountTypesId),
        parent: Joi.number().integer(),
    }),
    query: Joi.optional(),
    params: Joi.optional(),
});

const simpleLoginSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
    query: Joi.optional(),
    params: Joi.optional(),
});

const forgetPasswordSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
    }),
    query: Joi.optional(),
    params: Joi.optional(),
})

const resetPasswordSchema = Joi.object({
    body: Joi.object({
        newPassword: Joi.string().required(),
        repeatPassword: Joi.ref('newPassword'),
    }).external(async (obj) => {
        try {
            const hashedPassword = await generateHash(obj.newPassword);
            obj.newPassword = hashedPassword;
            return obj;
        } catch (error) {
            throw error;
        }
    }),
    query: Joi.object({
        resetToken: Joi.string().required(),
    }),
    params: Joi.optional(),
});

module.exports = {
    createAccountSchema,
    simpleLoginSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
};
