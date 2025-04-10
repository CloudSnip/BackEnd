import { Router } from "express";
import { actions } from "./controller.ts";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Measurements
 *   description: API endpoints for managing measurements
 */

/**
 * @swagger
 * /measurements:
 *   get:
 *     summary: Retrieve a list of measurements
 *     tags: [Measurements]
 *     responses:
 *       200:
 *         description: A list of measurements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Measurement'
 */
router.get('/', actions.getAll)

export default router;