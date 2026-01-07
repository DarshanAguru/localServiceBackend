import { Router } from 'express';
import {
  jwtAuthMiddleware,
  requireAuth,
  requireRole,
} from '../../../middlewares/jwtMiddleware.js';
import {
  addAppointment,
  deleteAppointment,
  getAppointmentData,
  getAppointmentsOfConsumer,
  getAppointmentsOfProvider,
  updateAppointmentDate,
  updateAppointmentStatus,
} from '../controllers/appointments.controller.js';
import { validationMiddleware } from '../../../middlewares/validationMiddleware.js';
import { appointmentSchema } from '../schemas/appointment.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Schedule a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: string
 *               providerId:
 *                 type: string
 *               description:
 *                 type: string
 *               preferredDate:
 *                 type: string
 *             required:
 *               - serviceId
 *               - providerId
 *               - preferredDate
 *     responses:
 *       201:
 *         description: Appointment scheduled successfully
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
 *                   $ref: '#/components/schemas/Appointment'
 *       209:
 *         description: Appointment already present
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  jwtAuthMiddleware,
  requireAuth,
  validationMiddleware(appointmentSchema),
  addAppointment,
);

/**
 * @swagger
 * /api/v1/appointments/p/{id}:
 *   get:
 *     summary: Get appointments for a provider
 *     tags: [Appointments]
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
 *         description: Appointments fetched successfully
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
 *                     $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointments found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/p/:id',
  jwtAuthMiddleware,
  requireAuth,
  requireRole(['PROVIDER']),
  getAppointmentsOfProvider,
);

/**
 * @swagger
 * /api/v1/appointments/c/{id}:
 *   get:
 *     summary: Get appointments for a consumer
 *     tags: [Appointments]
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
 *         description: Appointments fetched successfully
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
 *                     $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointments found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/c/:id',
  jwtAuthMiddleware,
  requireAuth,
  requireRole(['CONSUMER']),
  getAppointmentsOfConsumer,
);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   get:
 *     summary: Get appointment data by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment data fetched successfully
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
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointment found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', jwtAuthMiddleware, requireAuth, getAppointmentData);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   delete:
 *     summary: Delete an appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
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
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointment found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', jwtAuthMiddleware, requireAuth, deleteAppointment);

/**
 * @swagger
 * /api/v1/appointments/updateDate/{id}:
 *   patch:
 *     summary: Update appointment date
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *             required:
 *               - date
 *     responses:
 *       200:
 *         description: Appointment date updated successfully
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
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointment found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/updateDate/:id',
  jwtAuthMiddleware,
  requireAuth,
  updateAppointmentDate,
);

/**
 * @swagger
 * /api/v1/appointments/updateStatus/{id}:
 *   patch:
 *     summary: Update appointment status
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
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
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointment found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/updateStatus/:id',
  jwtAuthMiddleware,
  requireAuth,
  requireRole(['PROVIDER', 'CONSUMER']),
  updateAppointmentStatus,
);

export default router;
