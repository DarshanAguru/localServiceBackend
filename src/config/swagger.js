import swaggerJsdoc from 'swagger-jsdoc';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url)),
);

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API v1',
      version: pkg.version || '1.0.0',
      description: 'API documentation for /api/v1',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Appointment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Appointment ID',
            },
            consumerId: {
              type: 'string',
              description: 'Consumer ID',
            },
            providerId: {
              type: 'string',
              description: 'Provider ID',
            },
            serviceId: {
              type: 'string',
              description: 'Service ID',
            },
            description: {
              type: 'string',
              description: 'Appointment description',
            },
            preferredDate: {
              type: 'string',
              description: 'Preferred date for the appointment',
            },
            status: {
              type: 'string',
              description: 'Appointment status',
            },
            date: {
              type: 'string',
              description: 'Scheduled date',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'Username (email)',
            },
            role: {
              type: 'string',
              description: 'User role',
            },
          },
        },
        UserDetails: {
          type: 'object',
          properties: {
            user_id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'Full name',
            },
            email: {
              type: 'string',
              description: 'Email address',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
            },
            age: {
              type: 'number',
              description: 'Age',
            },
            gender: {
              type: 'string',
              description: 'Gender',
            },
            address: {
              type: 'string',
              description: 'Address',
            },
            location: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'string',
                  description: 'Latitude',
                },
                longitude: {
                  type: 'string',
                  description: 'Longitude',
                },
              },
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            role: {
              type: 'string',
              description: 'User role',
            },
            access: {
              type: 'string',
              description: 'Access token',
            },
            refresh: {
              type: 'string',
              description: 'Refresh token',
            },
          },
        },
        RefreshResponse: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Username',
            },
            role: {
              type: 'string',
              description: 'User role',
            },
            access: {
              type: 'string',
              description: 'New access token',
            },
            refresh: {
              type: 'string',
              description: 'New or existing refresh token',
            },
            refreshRotated: {
              type: 'boolean',
              description: 'Whether refresh token was rotated',
            },
            expiresIn: {
              type: 'object',
              properties: {
                access: {
                  type: 'string',
                  description: 'Access token expiry',
                },
                refresh: {
                  type: 'string',
                  description: 'Refresh token expiry',
                },
              },
            },
          },
        },
        Provider: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Provider ID',
            },
            name: {
              type: 'string',
              description: 'Provider name',
            },
            email: {
              type: 'string',
              description: 'Provider email',
            },
            phone: {
              type: 'string',
              description: 'Provider phone',
            },
            location: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'string',
                  description: 'Latitude',
                },
                longitude: {
                  type: 'string',
                  description: 'Longitude',
                },
              },
            },
            distance: {
              type: 'string',
              description: 'Distance from consumer (if filtered)',
            },
          },
        },
        ProviderDetails: {
          type: 'object',
          properties: {
            provider_details: {
              $ref: '#/components/schemas/UserDetails',
            },
            services: {
              type: 'array',
              items: {
                type: 'string',
                description: 'Service ID',
              },
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Review ID',
            },
            consumerId: {
              type: 'string',
              description: 'Consumer ID',
            },
            providerId: {
              type: 'string',
              description: 'Provider ID',
            },
            serviceId: {
              type: 'string',
              description: 'Service ID',
            },
            rating: {
              type: 'number',
              description: 'Rating given by consumer',
            },
            comment: {
              type: 'string',
              description: 'Review comment',
            },
            createdAt: {
              type: 'string',
              description: 'Review creation timestamp',
            },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Service ID',
            },
            name: {
              type: 'string',
              description: 'Service name',
            },
            description: {
              type: 'string',
              description: 'Service description',
            },
            category: {
              type: 'string',
              description: 'Service category',
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: 'Appointments',
        description: 'Appointment management endpoints',
      },
      {
        name: 'Auth',
        description: 'Authentication and user management endpoints',
      },
      {
        name: 'Providers',
        description: 'Provider management endpoints',
      },
      {
        name: 'Reviews',
        description: 'Review management endpoints',
      },
      {
        name: 'Services',
        description: 'Service management endpoints',
      },
    ],
  },
  // Point to your route/controller files where JSDoc comments exist
  apis: ['src/api/v1/routes/**/*.js'],
});
