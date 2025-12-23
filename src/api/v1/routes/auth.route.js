import { Router } from 'express';
import {
  login,
  register,
  logout,
  refreshToken,
  getAllConsumers,
  getAllProviders,
  getUserDetailsById,
} from '../controllers/auth.controller.js';
import {
  jwtAuthMiddleware,
  optionalAuth,
  requireAuth,
  requireRole,
} from '../../../middlewares/jwtMiddleware.js';
import { validationMiddleware } from '../../../middlewares/validationMiddleware.js';
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from '../schemas/auth.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 4
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', validationMiddleware(loginSchema), login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 4
 *               address:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: string
 *                   longitude:
 *                     type: string
 *               age:
 *                 type: number
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *               gender:
 *                 type: string
 *             required:
 *               - name
 *               - password
 *               - age
 *               - phone
 *               - email
 *               - role
 *               - gender
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.post('/register', validationMiddleware(registerSchema), register);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/RefreshResponse'
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
router.post(
  '/refresh',
  validationMiddleware(refreshTokenSchema),
  optionalAuth,
  refreshToken,
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   type: null
 *       500:
 *         description: Internal server error
 */
router.post('/logout', jwtAuthMiddleware, requireAuth, logout);

/**
 * @swagger
 * /api/v1/auth/providers:
 *   get:
 *     summary: Get all providers (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Providers fetched successfully
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
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get(
  '/providers',
  jwtAuthMiddleware,
  requireAuth,
  requireRole(['ADMIN']),
  getAllProviders,
);

/**
 * @swagger
 * /api/v1/auth/consumers:
 *   get:
 *     summary: Get all consumers (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Consumers fetched successfully
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
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get(
  '/consumers',
  jwtAuthMiddleware,
  requireAuth,
  requireRole(['ADMIN']),
  getAllConsumers,
);

/**
 * @swagger
 * /api/v1/auth/userProfile/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details fetched successfully
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
 *                   $ref: '#/components/schemas/UserDetails'
 *       404:
 *         description: No user details found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/userProfile/:id',
  jwtAuthMiddleware,
  requireAuth,
  getUserDetailsById,
);

export default router;
