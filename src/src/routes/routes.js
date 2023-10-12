import { Router } from 'express';
import indexController from '../controllers/index-controller.js';

const router = Router();

/* ********* DEFAULT ROUTES *********** */

router.route('/').get(indexController);

export default router;
