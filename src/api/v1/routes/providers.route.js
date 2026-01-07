import { Router } from 'express';
import {
  getDetailsOfProvider,
  addServices,
  getAllProvidersOfService,
  getTopProvidersOfArea,
} from '../controllers/providers.controller.js';
import {
  jwtAuthMiddleware,
  optionalAuth,
  requireAuth,
  requireRole,
} from '../../../middlewares/jwtMiddleware.js';
import { validationMiddleware } from '../../../middlewares/validationMiddleware.js';
import { addServiceSchema } from '../schemas/services.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/providers/s/{serviceId}:
 *   get:
 *     summary: Get all providers for a service
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *       - in: query
 *         name: byLocationThres
 *         schema:
 *           type: number
 *         description: Location threshold in km (3-30)
 *     responses:
 *       200:
 *         description: Providers list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceProvider'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.get('/s/:serviceId', optionalAuth, getAllProvidersOfService);

/**
 * @swagger
 * /api/v1/providers/getTopProvidersOfArea:
 *   get:
 *     summary: Get top Provider of Area
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: Providers list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceProvider'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.get('/getTopProvidersOfArea', optionalAuth, getTopProvidersOfArea);

/**
 * @swagger
 * /api/v1/providers/addServices:
 *   post:
 *     summary: Add services to a provider
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - providerId
 *               - serviceIds
 *     responses:
 *       200:
 *         description: Services added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *       500:
 *         description: Internal server error
 */
router.post(
  '/addServices',
  jwtAuthMiddleware,
  requireAuth,
  requireRole(['PROVIDER']),
  validationMiddleware(addServiceSchema),
  addServices,
);

/**
 * @swagger
 * /api/v1/providers/{id}:
 *   get:
 *     summary: Get details of a provider
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Provider ID
 *     responses:
 *       200:
 *         description: Provider details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProviderDetails'
 *       404:
 *         description: No provider found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', jwtAuthMiddleware, requireAuth, getDetailsOfProvider);

export default router;
