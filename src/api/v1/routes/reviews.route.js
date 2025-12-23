import { Router } from 'express';
import {
  jwtAuthMiddleware,
  requireAuth,
} from '../../../middlewares/jwtMiddleware.js';
import {
  addReview,
  deleteReview,
  getReviewData,
  getReviewsOfConsumer,
  getReviewsOfProvider,
} from '../controllers/reviews.controller.js';
import { validationMiddleware } from '../../../middlewares/validationMiddleware.js';
import { reviewSchema } from '../schemas/review.schema.js';


const router = Router();

/**
 * @swagger
 * /api/v1/reviews:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               providerId:
 *                 type: string
 *               serviceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
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
 *                   $ref: '#/components/schemas/Review'
 *       209:
 *         description: Review already present
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  jwtAuthMiddleware,
  requireAuth,
  validationMiddleware(reviewSchema),
  addReview,
);

/**
 * @swagger
 * /api/v1/reviews/p/{id}:
 *   get:
 *     summary: Get reviews of a provider
 *     tags: [Reviews]
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
 *         description: Reviews fetched successfully
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
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: No reviews found
 *       500:
 *         description: Internal server error
 */
router.get('/p/:id', jwtAuthMiddleware, requireAuth, getReviewsOfProvider);

/**
 * @swagger
 * /api/v1/reviews/c/{id}:
 *   get:
 *     summary: Get reviews of a consumer
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Consumer ID
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
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
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: No reviews found
 *       500:
 *         description: Internal server error
 */
router.get('/c/:id', jwtAuthMiddleware, requireAuth, getReviewsOfConsumer);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Get review data by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review data fetched successfully
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
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: No review found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', jwtAuthMiddleware, requireAuth, getReviewData);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
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
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: No review found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', jwtAuthMiddleware, requireAuth, deleteReview);

export default router;
