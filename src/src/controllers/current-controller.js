import httpStatus from 'http-status';
import catchAsync from '../utils/catch-async.js';
import { CurrentUsersService } from '../services/connections-service.js';

const currentController = catchAsync(async (req, res) => {
    const users = await CurrentUsersService(req.query.results, req.query.fields);

    res.status(httpStatus.OK).send(users);
    // if (some error condition) {
    //     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    // }
});

export default currentController;
