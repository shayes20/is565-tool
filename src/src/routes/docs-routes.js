import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import swaggerDefinition from '../docs/swagger-definition.js';

const router = Router();

const specs = swaggerJSDoc({
    swaggerDefinition,
    apis: ['src/docs/*.yml', 'src/routes/*.js']
});

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, { explorer: true }));

export default router;
