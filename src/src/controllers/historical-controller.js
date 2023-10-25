import httpStatus from 'http-status';
import catchAsync from '../utils/catch-async.js';
// import indexService from '../services/index-service.js';

const historicalController = catchAsync(async (req, res) => {
    // const users = await indexService(req.query.results, req.query.fields);

    res.status(httpStatus.OK).send('ok');
    // if (some error condition) {
    //     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    // }
});

export default historicalController;
