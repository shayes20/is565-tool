import catchAsync from '../utils/catch-async.js';
import { historicalConnectionsService } from '../services/connections-service.js';

const historicalController = catchAsync(async (req, res) => {
    const connections = await historicalConnectionsService();

    res.send(connections);
});

export default historicalController;
