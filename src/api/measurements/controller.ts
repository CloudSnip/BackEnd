import { generateControllers } from "../../utils/lib/generator/index.ts";
import Measurements from "./model.ts"

const actions = generateControllers(Measurements, "measurements");

actions.getWeeklyAverage = async (req, res) => {
    try {
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const endDate = new Date();

        const rawData = await Measurements.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        deviceId: "$deviceId",
                        day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    },
                    averageTemperature: { $avg: "$temperature" },
                    averageHumidity: { $avg: "$humidity" },
                },
            },
            {
                $project: {
                    _id: 0,
                    deviceId: "$_id.deviceId",
                    day: "$_id.day",
                    averageTemperature: 1,
                    averageHumidity: 1,
                },
            },
            {
                $sort: { day: 1, deviceId: 1 },
            },
        ]);

        const data = rawData.reduce((acc, item) => {
            if (!acc[item.day]) {
                acc[item.day] = [];
            }
            acc[item.day].push({
                deviceId: item.deviceId,
                averageTemperature: item.averageTemperature,
                averageHumidity: item.averageHumidity,
            });
            return acc;
        }, {});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error " + error.message });
    }
};

actions.get12HourAverage = async (req, res) => {
    try {
        const startDate = new Date(Date.now() - 12 * 60 * 60 * 1000);
        const endDate = new Date();

        const rawData = await Measurements.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        deviceId: "$deviceId",
                        hour: { $dateToString: { format: "%Y-%m-%dT%H:00:00", date: "$timestamp" } },
                    },
                    averageTemperature: { $avg: "$temperature" },
                    averageHumidity: { $avg: "$humidity" },
                },
            },
            {
                $project: {
                    _id: 0,
                    deviceId: "$_id.deviceId",
                    hour: "$_id.hour",
                    averageTemperature: 1,
                    averageHumidity: 1,
                },
            },
            {
                $sort: { hour: 1, deviceId: 1 },
            },
        ]);

        const data = rawData.reduce((acc, item) => {
            if (!acc[item.hour]) {
                acc[item.hour] = [];
            }
            acc[item.hour].push({
                deviceId: item.deviceId,
                averageTemperature: item.averageTemperature,
                averageHumidity: item.averageHumidity,
            });
            return acc;
        }, {});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error " + error.message });
    }
};

export { actions }

