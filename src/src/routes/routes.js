import { Router } from 'express';
import currentController from '../controllers/current-controller.js';
import historicalController from '../controllers/historical-controller.js';
import graphController from '../controllers/graph-controller.js';

const router = Router();

/* ********* DEFAULT ROUTES *********** */

router.route('/currentConnections').get(currentController);
router.route('/historicalConnections').get(historicalController);
router.route('/graph').get(graphController);

export default router;
