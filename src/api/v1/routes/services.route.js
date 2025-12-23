import { Router } from 'express';
import {
  getAllServices,
  verifyProviderService,
} from '../controllers/services.controller.js';
import {
  jwtAuthMiddleware,
  requireAuth,
  requireRole,
} from '../../../middlewares/jwtMiddleware.js';
import { validationMiddleware } from '../../../middlewares/validationMiddleware.js';
import { verifyProviderServiceSchema } from '../schemas/services.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Services fetched successfully
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
 *                     $ref: '#/components/schemas/Service'
 *       404:
 *         description: No services found
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllServices);

/**
 * @swagger
 * /api/v1/services/verifyProvider/{serviceId}:
 *   post:
 *     summary: Verify provider for a service (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               providerId:
 *                 type: string
 *             required:
 *               - providerId
 *     responses:
 *       200:
 *         description: Verification status updated successfully
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
 *                     status:
 *                       type: boolean
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/verifyProvider/:serviceId',
  jwtAuthMiddleware,
  requireAuth,
  requireRole(['ADMIN']),
  validationMiddleware(verifyProviderServiceSchema),
  verifyProviderService,
);

export default router;
