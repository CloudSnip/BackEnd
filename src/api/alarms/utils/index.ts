import { generalLogger } from "../../../services/logger/winston.ts"
import { IAlarm } from "../model.ts"
import Sensors from "../../sensors/model.ts"
import _ from 'lodash'

export type sensorMqttMessage = {
    sensorCode: string,
    value: string,
    hum: string
    timestamp: string
}

export const toJSON = function (this: IAlarm) {
    return this.toObject()
}
