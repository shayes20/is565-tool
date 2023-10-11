import httpStatus from 'http-status';
import catchAsync from '../utils/catch-async.js';
import {
    loginUserWithEmailAndPasswordService,
    logoutService,
    refreshAuthService,
    resetPasswordService,
    verifyEmailService
} from '../services/auth-service.js';
import { createUserService } from '../services/user-service.js';
import {
    generateAuthTokensService,
    generateResetPasswordTokenService,
    generateVerifyEmailTokenService
} from '../services/token-service.js';
import {
    sendResetPasswordEmailService,
    sendVerificationEmailService
} from '../services/email-service.js';

export const registerController = catchAsync(async (req, res) => {
    const user = await createUserService(req.body);
    const tokens = await generateAuthTokensService(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
});

export const loginController = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await loginUserWithEmailAndPasswordService(email, password);
    const tokens = await generateAuthTokensService(user);
    res.send({ user, tokens });
});

export const logoutController = catchAsync(async (req, res) => {
    await logoutService(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokensController = catchAsync(async (req, res) => {
    const tokens = await refreshAuthService(req.body.refreshToken);
    res.send({ ...tokens });
});

export const forgotPasswordController = catchAsync(async (req, res) => {
    const resetPasswordToken = await generateResetPasswordTokenService(
        req.body.email
    );
    await sendResetPasswordEmailService(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
});

export const resetPasswordController = catchAsync(async (req, res) => {
    await resetPasswordService(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmailController = catchAsync(async (req, res) => {
    const verifyEmailToken = await generateVerifyEmailTokenService(req.user);
    await sendVerificationEmailService(req.user.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmailController = catchAsync(async (req, res) => {
    await verifyEmailService(req.query.token);
    res.status(httpStatus.NO_CONTENT).send();
});
