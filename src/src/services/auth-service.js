import httpStatus from 'http-status';
import Token from '../models/Token.js';
import ApiError from '../utils/ApiError.js';
import tokenTypes from '../config/tokens.js';
import {
    getUserByEmailService,
    getUserByIdService,
    updateUserByIdService
} from './user-service.js';
import {
    verifyTokenService,
    generateAuthTokensService
} from './token-service.js';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPasswordService = async (email, password) => {
    const user = await getUserByEmailService(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Incorrect email or password'
        );
    }
    return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logoutService = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({
        token: refreshToken,
        type: tokenTypes.REFRESH,
        blacklisted: false
    });
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuthService = async (refreshToken) => {
    try {
        const refreshTokenDoc = await verifyTokenService(
            refreshToken,
            tokenTypes.REFRESH
        );
        const user = await getUserByIdService(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.remove();
        return generateAuthTokensService(user);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const resetPasswordService = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDoc = await verifyTokenService(
            resetPasswordToken,
            tokenTypes.RESET_PASSWORD
        );
        const user = await getUserByIdService(resetPasswordTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await updateUserByIdService(user.id, { password: newPassword });
        await Token.deleteMany({
            user: user.id,
            type: tokenTypes.RESET_PASSWORD
        });
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmailService = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDoc = await verifyTokenService(
            verifyEmailToken,
            tokenTypes.VERIFY_EMAIL
        );
        const user = await getUserByIdService(verifyEmailTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await Token.deleteMany({
            user: user.id,
            type: tokenTypes.VERIFY_EMAIL
        });
        await updateUserByIdService(user.id, { isEmailVerified: true });
    } catch (error) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Email verification failed'
        );
    }
};
