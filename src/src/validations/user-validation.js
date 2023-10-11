import Joi from 'joi';
import { passwordValidation, objectIdValidation } from './custom-validation.js';
import { getAllRoleNamesService } from '../services/role-service.js';

export const createUserValidation = async () => {
    const roleNames = await getAllRoleNamesService();

    return {
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().custom(passwordValidation),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            role: Joi.string().required().valid(roleNames)
        })
    };
};

export const getUsersValidation = {
    query: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer()
    })
};

export const getUserValidation = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectIdValidation)
    })
};

export const updateUserValidation = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectIdValidation)
    }),
    body: Joi.object()
        .keys({
            email: Joi.string().email(),
            password: Joi.string().custom(passwordValidation),
            firstName: Joi.string(),
            lastName: Joi.string()
        })
        .min(1)
};

export const deleteUserValidation = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectIdValidation)
    })
};
