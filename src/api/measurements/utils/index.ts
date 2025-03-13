import { generalLogger } from "../../../services/logger/winston.ts"
import { IMeasurement } from "../model.ts"
// import _ from 'lodash'
// import { generalLogger } from "../../../services/logger/winston.ts"

export type sensorMqttMessage = {
    sensorCode: string,
    value: string,
    hum: string
    timestamp: string
 }

export const toJSON = function(this: IMeasurement){
    return this.toJSON()
}

export async function parseMessage(message: sensorMqttMessage){
    generalLogger.info(JSON.stringify(message))
    const { sensorCode, value, hum, timestamp } = message;
   /*  const sensor = await Sensor.findOne({ code: sensorCode });

    if (_.isNil(sensor)) {
        return generalLogger.error('sensor not found with code: ' + sensorCode)
    } */

    /* const alarmsToCheck = await Alarm.find({sensorId: sensor._id, type: 'rule'})

    await BluePromise.map(alarmsToCheck, (alarm: any) => {
        return checkRule(Number(value), alarm.rule, sensor._id, alarm._id, alarm.name)
    }) */

    return await this.create({
        deviceId: sensorCode,
        temperature: value,
        humidity: hum || 40,
        timestamp: timestamp
    })
}