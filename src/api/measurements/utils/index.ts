import { generalLogger } from "../../../services/logger/winston.ts"
import { IMeasurement } from "../model.ts"
import Sensors from "../../sensors/model.ts"
import _ from 'lodash'
import Alarms, { AlarmStatus } from "../../alarms/model.ts"

export type sensorMqttMessage = {
    sensorCode: string,
    value: string,
    hum: string
    timestamp: string
}

// eslint-disable-next-line no-unused-vars
export const toJSON = function (this: IMeasurement) {
    return this.toObject()
}

export async function parseMessage(message: sensorMqttMessage) {
    generalLogger.info(JSON.stringify(message))
    const { sensorCode, value, hum, timestamp } = message;
    let sensor = await Sensors.findOne({ name: sensorCode });

    if (_.isNil(sensor)) {
        generalLogger.error('sensor not found with code: ' + sensorCode)
        sensor = await Sensors.create({
            name: sensorCode
        })
    }

    const alarmToCheck = await Alarms.findOne({ sensorId: sensor._id, status: AlarmStatus.PENDING }).sort({ createdAt: -1 })

    if (_.isNil(alarmToCheck) && Number(value) >= 25) {
        await Alarms.create({
            description: 'Temperature is higher than 25',
            status: AlarmStatus.PENDING,
            sensorId: sensor._id
        })
    } else if (!_.isNil(alarmToCheck) && Number(value) < 25) {
        await Alarms.updateOne({ _id: alarmToCheck._id }, { status: AlarmStatus.RESOLVED })
    }


    return await this.create({
        deviceId: sensor._id,
        temperature: value,
        humidity: hum || 40,
        timestamp: timestamp
    })
}