import { Router } from 'express';
import config from '../config/config.js';
import docRoutes from './docs-routes.js';
import userRoutes from './user-routes.js';
import authRoutes from './auth-routes.js';

const router = Router();

/* ********* DEFAULT ROUTES *********** */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

/* ********* AVAILABLE ONLY IN DEVELOPMENT MODE *********** */
if (config.env === 'development') {
    router.use('/docs', docRoutes);
}

export default router;
