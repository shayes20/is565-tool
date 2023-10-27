import catchAsync from '../utils/catch-async.js';
import { graphService } from '../services/connections-service.js';

const graphController = catchAsync(async (req, res) => {
    const connections = await graphService();

    res.send(connections);
});

export default graphController;
