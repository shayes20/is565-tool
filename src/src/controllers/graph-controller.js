import httpStatus from 'http-status';
import catchAsync from '../utils/catch-async.js';
import { graphService } from '../services/connections-service.js';


const graphController = catchAsync(async (req, res) => {
    const users = await graphServiceService(req.query.results, req.query.fields);

    res.status(httpStatus.OK).send('ok');
    // if (some error condition) {
    //     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    // }
});

export default graphController;
