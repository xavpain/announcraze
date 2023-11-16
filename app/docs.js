const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
        title: 'AnnounCraze API',
        version: '1.0.0',
        description: 'API for AnnounCraze',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./app/routes/users.js', './app/routes/products.js'],
};
exports.swaggerOptions = swaggerOptions;
