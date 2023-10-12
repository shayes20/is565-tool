import httpStatus from 'http-status';
import catchAsync from '../utils/catch-async.js';

const indexController = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send('ok');
    // if (some error condition) {
    //     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    // }
});

export default indexController;
