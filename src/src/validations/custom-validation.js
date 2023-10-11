import validPassword from '../utils/valid-password.js';

export const objectIdValidation = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};

export const passwordValidation = (value, helpers) => {
    if (value.length < 15) {
        return helpers.message('password must be at least 15 characters');
    }
    if (!validPassword.test(value)) {
        return helpers.message(
            'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
        );
    }
    return value;
};
