import { Router } from 'express';
import * as ctrl from '../controllers/mechanics.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { listMechanicsSchema, getMechanicSchema } from '../schemas/mechanics.schema.js';

const router = Router();

/**
 * @openapi
 * /api/mechanics:
 *   get:
 *     summary: List all mechanics
 *     tags: [Mechanics]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, ON_JOB, OFFLINE]
 *     responses:
 *       200:
 *         description: List of mechanics with status and stats
 */
router.get('/', validateRequest(listMechanicsSchema), asyncHandler(ctrl.listMechanics));

/**
 * @openapi
 * /api/mechanics/{id}:
 *   get:
 *     summary: Get mechanic by ID
 *     tags: [Mechanics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mechanic detail with recent bookings
 *       404:
 *         description: Mechanic not found
 */
router.get('/:id', validateRequest(getMechanicSchema), asyncHandler(ctrl.getMechanic));

export default router;
