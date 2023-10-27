import httpStatus from 'http-status';
import catchAsync from '../utils/catch-async.js';
import { historicalUsersService } from '../services/connections-service.js';

const historicalController = catchAsync(async (req, res) => {
    const users = await historicalUsersService(req.query.results, req.query.fields);

    res.status(httpStatus.OK).send(users);
    // if (some error condition) {
    //     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    // }
});

export default historicalController;
