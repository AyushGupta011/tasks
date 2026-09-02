import { Router } from 'express';
import * as ctrl from '../controllers/customers.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { listCustomersSchema } from '../schemas/customers.schema.js';

const router = Router();

/**
 * @openapi
 * /api/customers:
 *   get:
 *     summary: List customers (paginated)
 *     tags: [Customers]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
 *     responses:
 *       200:
 *         description: Paginated list of customers
 */
router.get('/', validateRequest(listCustomersSchema), asyncHandler(ctrl.listCustomers));

export default router;
