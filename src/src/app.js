import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import { successHandler, errorHandler } from './config/morgan.js';
import config from './config/config.js';
import authLimiter from './middlewares/rate-limiter.js';
import router from './routes/routes.js';
import ApiError from './utils/ApiError.js';
import { errorConverter } from './middlewares/error.js';
import pool from './db.js';

const app = express();

app.get('/data', async (req, res) => {
    try {
        const [rows, fields] = await pool.query(
            'SELECT * FROM your_table_name'
        ); // Execute a query
        res.json(rows); // Send the retrieved data as a JSON response
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

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

// GZIP compression when able for responses back to client (increases speed)
app.use(compression());

// Enable cors
app.use(cors());
app.options('*', cors());

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
