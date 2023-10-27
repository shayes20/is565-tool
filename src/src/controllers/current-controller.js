import catchAsync from '../utils/catch-async.js';
import { currentConnectionsService } from '../services/connections-service.js';

const currentController = catchAsync(async (req, res) => {
    const connections = await currentConnectionsService();

    res.send(connections);
});

export default currentController;
