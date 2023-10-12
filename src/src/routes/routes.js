import { Router } from 'express';
import dashboardRoutes from '../routes/dashboard-routes.js';
import config from '../config/config.js';
import docRoutes from './docs-routes.js';
import userRoutes from './user-routes.js';
import indexController form '../controllers/index-controller';

const router = Router();

/* ********* DEFAULT ROUTES *********** */

router
    .route('/')
    .post(
        validate(await createUserValidation()),
        createUserController
    )
    .get(auth('getUsers'), validate(getUsersValidation), getUsersController);



export default router;
