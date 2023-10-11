import config from '../config/config.js';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'backend-boilerplate API documentation',
        version: '1.0.0',
        description: 'Boilerplate for backend APIs'
    },
    servers: [{ url: `http://localhost:${config.port}` }]
};

export default swaggerDefinition;
