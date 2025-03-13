import { Router } from "express";
import { actions } from "./controller.ts";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sensors
 *   description: API endpoints for managing sensors
 */

/**
 * @swagger
 * /sensors:
 *   get:
 *     summary: Retrieve a list of sensors
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: A list of sensor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 */
router.get('/', actions.getAll)

/**
 * @swagger
 * /sensor:
 *   post:
 *     summary: Create a new sensor
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sensor'
 *     responses:
 *       201:
 *         description: The created sensor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       400:
 *         description: Bad request
 */
router.post('/', actions.create);

export default router;