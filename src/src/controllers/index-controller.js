import httpStatus from 'http-status';
import catchAsync from '../utils/catch-async.js';

const indexController = catchAsync(async (req, res) => {
    res.status(httpStatus[200]).send('ok');
});

export default indexController;