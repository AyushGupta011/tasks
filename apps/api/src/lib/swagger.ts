import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Instant Mechanic API',
      version: '1.0.0',
      description:
        'REST API for the Instant Mechanic live vehicle-service operations dashboard. Provides endpoints for managing bookings, mechanics, customers, and dashboard analytics.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
