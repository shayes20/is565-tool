import Joi from 'joi';
import { passwordValidation } from './custom-validation.js';

export const registerValidation = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(passwordValidation),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    })
};

export const loginValidation = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
};

export const logoutValidation = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required()
    })
};

export const refreshTokensValidation = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required()
    })
};

export const forgotPasswordValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required()
    })
};

export const resetPasswordValidation = {
    query: Joi.object().keys({
        token: Joi.string().required()
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(passwordValidation)
    })
};

export const verifyEmailValidation = {
    query: Joi.object().keys({
        token: Joi.string().required()
    })
};
