import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getDashboardSchema } from '../schemas/dashboard.schema.js';

const router = Router();

/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard aggregate statistics
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days for time-series data (1-90)
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalBookings:
 *                       type: integer
 *                     todayBookings:
 *                       type: integer
 *                     completedBookings:
 *                       type: integer
 *                     pendingBookings:
 *                       type: integer
 *                     cancelledBookings:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     activeMechanics:
 *                       type: integer
 *                     newCustomers:
 *                       type: integer
 */
router.get('/', validateRequest(getDashboardSchema), asyncHandler(getDashboard));

export default router;
