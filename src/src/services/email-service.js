import nodemailer from 'nodemailer';
import config from '../config/config.js';
import logger from '../config/logger.js';
import getPasswordResetEmail from '../html/password-reset-email.js';
import getVerifyEmail from '../html/verify-email.js';

export const transportService = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
    transportService
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() =>
            logger.warn(
                'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
            )
        );
}

/**
 * Send an email
 * @param {string[]} to
 * @param {string[]} cc
 * @param {string} subject
 * @param {string} body
 * @param {boolean} isHtml
 * @returns {Promise}
 */
export const sendEmailService = async (
    to,
    cc,
    subject,
    body,
    isHtml = false
) => {
    const msg = {
        from: config.email.from,
        to,
        cc,
        subject
    };

    if (isHtml) msg.html = body;
    else msg.text = body;

    await transportService.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendResetPasswordEmailService = async (to, token) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password route on the backend server
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const body = await getPasswordResetEmail(to, resetPasswordUrl);
    await sendEmailService(to, [], subject, body, true);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendVerificationEmailService = async (to, token) => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification route on the backend server
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const body = await getVerifyEmail(to, verificationEmailUrl);
    await sendEmailService(to, [], subject, body, true);
};
