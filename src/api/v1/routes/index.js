import { Router } from 'express';
import auth from './auth.route.js';
import services from './services.route.js';
import providers from './providers.route.js';
import appointments from './appointments.route.js';
import reviews from './reviews.route.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and user management endpoints
 *   - name: Services
 *     description: Service catalog and provider verification
 *   - name: Providers
 *     description: Provider details and service assignments
 *   - name: Appointments
 *     description: Appointment scheduling and management
 *   - name: Reviews
 *     description: Consumer and provider reviews
 */

router.use('/auth', auth);
router.use('/services', services);
router.use('/providers', providers);
router.use('/appointments', appointments);
router.use('/reviews', reviews);

export { router };
