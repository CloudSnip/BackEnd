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

/**
 * @swagger
 * /measurements/weekly-average:
 *   get:
 *     summary: Retrieve the weekly average temperature and humidity
 *     tags: [Measurements]
 *     responses:
 *       200:
 *         description: Weekly average temperature and humidity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageTemperature:
 *                   type: number
 *                   description: Average temperature over the last 7 days
 *                 averageHumidity:
 *                   type: number
 *                   description: Average humidity over the last 7 days
 */
router.get('/weekly-average', actions.getWeeklyAverage);

/**
 * @swagger
 * /measurements/12-hour-average:
 *   get:
 *     summary: Retrieve the average temperature and humidity over the last 12 hours
 *     tags: [Measurements]
 *     responses:
 *       200:
 *         description: Average temperature and humidity over the last 12 hours
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageTemperature:
 *                   type: number
 *                   description: Average temperature over the last 12 hours
 *                 averageHumidity:
 *                   type: number
 *                   description: Average humidity over the last 12 hours
 */
router.get('/12-hour-average', actions.get12HourAverage);


export default router;