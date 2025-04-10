import { Router } from 'express';
import { actions } from './controller.ts';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Alarms
 *   description: API endpoints for managing alarms
 */

/**
 * @swagger
 * /alarms:
 *   get:
 *     summary: Retrieve a list of alarms
 *     tags: [Alarms]
 *     responses:
 *       200:
 *         description: A list of alarms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alarm'
 */
router.get('/', actions.getAll);

export default router;