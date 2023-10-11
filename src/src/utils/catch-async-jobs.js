import logger from '../config/logger.js';

const catchAsyncJobs =
    (fn) =>
    async (...args) => {
        try {
            await fn(...args);
        } catch (err) {
            logger.error(err);
        }
    };

export default catchAsyncJobs;
