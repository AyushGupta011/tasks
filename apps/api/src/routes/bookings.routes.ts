import { Router } from 'express';
import * as ctrl from '../controllers/bookings.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  listBookingsSchema,
  getBookingSchema,
  updateBookingStatusSchema,
} from '../schemas/bookings.schema.js';

const router = Router();

/**
 * @openapi
 * /api/bookings:
 *   get:
 *     summary: List bookings (paginated, filterable, sortable)
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ASSIGNED, MECHANIC_ON_THE_WAY, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: mechanicId
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by customer name, booking ID, or plate
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, amount, status, scheduledAt]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Paginated list of bookings
 */
router.get('/', validateRequest(listBookingsSchema), asyncHandler(ctrl.listBookings));

/**
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking detail
 *       404:
 *         description: Booking not found
 */
router.get('/:id', validateRequest(getBookingSchema), asyncHandler(ctrl.getBooking));

/**
 * @openapi
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ASSIGNED, MECHANIC_ON_THE_WAY, IN_PROGRESS, COMPLETED, CANCELLED]
 *               mechanicId:
 *                 type: string
 *                 description: Required when transitioning to ASSIGNED
 *     responses:
 *       200:
 *         description: Updated booking
 *       400:
 *         description: Invalid transition or validation error
 *       404:
 *         description: Booking not found
 */
router.patch(
  '/:id/status',
  validateRequest(updateBookingStatusSchema),
  asyncHandler(ctrl.updateBookingStatus)
);

export default router;
