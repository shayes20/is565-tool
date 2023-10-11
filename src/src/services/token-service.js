import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../config/config.js';
import Token from '../models/Token.js';
import ApiError from '../utils/ApiError.js';
import tokenTypes from '../config/tokens.js';
import { getUserByEmailService } from './user-service.js';

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateTokenService = (
    userId,
    expires,
    type,
    secret = config.jwt.secret
) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    };
    return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
export const saveTokenService = async (
    token,
    userId,
    expires,
    type,
    blacklisted = false
) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted
    });
    return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const verifyTokenService = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({
        token,
        type,
        user: payload.sub,
        blacklisted: false
    });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokensService = async (user) => {
    const accessTokenExpires = moment().add(
        config.jwt.accessExpirationMinutes,
        'minutes'
    );
    const accessToken = generateTokenService(
        user.id,
        accessTokenExpires,
        tokenTypes.ACCESS
    );

    const refreshTokenExpires = moment().add(
        config.jwt.refreshExpirationDays,
        'days'
    );
    const refreshToken = generateTokenService(
        user.id,
        refreshTokenExpires,
        tokenTypes.REFRESH
    );
    await saveTokenService(
        refreshToken,
        user.id,
        refreshTokenExpires,
        tokenTypes.REFRESH
    );

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordTokenService = async (email) => {
    const user = await getUserByEmailService(email);
    if (!user) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'No users found with this email'
        );
    }
    const expires = moment().add(
        config.jwt.resetPasswordExpirationMinutes,
        'minutes'
    );
    const resetPasswordToken = generateTokenService(
        user.id,
        expires,
        tokenTypes.RESET_PASSWORD
    );
    await saveTokenService(
        resetPasswordToken,
        user.id,
        expires,
        tokenTypes.RESET_PASSWORD
    );
    return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailTokenService = async (user) => {
    const expires = moment().add(
        config.jwt.verifyEmailExpirationMinutes,
        'minutes'
    );
    const verifyEmailToken = generateTokenService(
        user.id,
        expires,
        tokenTypes.VERIFY_EMAIL
    );
    await saveTokenService(
        verifyEmailToken,
        user.id,
        expires,
        tokenTypes.VERIFY_EMAIL
    );
    return verifyEmailToken;
};
