import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import jwtStrategy from './config/passport.js';
import { successHandler, errorHandler } from './config/morgan.js';
import config from './config/config.js';
import authLimiter from './middlewares/rate-limiter.js';
import router from './routes/routes.js';
import ApiError from './utils/ApiError.js';
import { errorConverter } from './middlewares/error.js';

const app = express();

if (config.env !== 'test') {
    app.use(successHandler);
    app.use(errorHandler);
}

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse url encoded
app.use(express.urlencoded({ extended: false }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

// GZIP compression when able for responses back to client (increases speed)
app.use(compression());

// Enable cors
app.use(cors());
app.options('*', cors());

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Limit repeated failed requests to auth endpoints in production
if (config.env === 'production') {
    app.use('/v1/auth', authLimiter);
}

// API routes
app.use('/', router);

// Send back 404 error for any unknown API request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

export default app;
