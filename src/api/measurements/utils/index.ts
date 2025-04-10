import { generalLogger } from "../../../services/logger/winston.ts"
import { IMeasurement } from "../model.ts"
import Sensors from "../../sensors/model.ts"
import _ from 'lodash'

export type sensorMqttMessage = {
    sensorCode: string,
    value: string,
    hum: string
    timestamp: string
 }

// eslint-disable-next-line no-unused-vars
export const toJSON = function(this: IMeasurement){
    return this.toObject()
}

export async function parseMessage(message: sensorMqttMessage){
    generalLogger.info(JSON.stringify(message))
    const { sensorCode, value, hum, timestamp } = message;
    let sensor = await Sensors.findOne({ name: sensorCode });

    if (_.isNil(sensor)) {
        generalLogger.error('sensor not found with code: ' + sensorCode)
        sensor = await Sensors.create({
            name: sensorCode
        })
    }

    /* const alarmsToCheck = await Alarm.find({sensorId: sensor._id, type: 'rule'})

    await BluePromise.map(alarmsToCheck, (alarm: any) => {
        return checkRule(Number(value), alarm.rule, sensor._id, alarm._id, alarm.name)
    }) */

    return await this.create({
        deviceId: sensor._id,
        temperature: value,
        humidity: hum || 40,
        timestamp: timestamp
    })
}