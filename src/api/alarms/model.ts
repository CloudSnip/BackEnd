import { ConfigurableSchema } from "../../utils/lib/mongoose/index.ts";
import mongooseToSwagger from 'mongoose-to-swagger';
import mongoose, { Document, Model } from 'mongoose';
import { Schema } from "mongoose";
import { toJSON } from "./utils/index.ts";

export enum AlarmStatus {
    RESOLVED = 'resolved',
    PENDING = 'pending',
}

export interface IAlarm extends Document {
    description: string;
    status: AlarmStatus;
    sensorId: Schema.Types.ObjectId;
}

interface IAlarmMethods {
    toJson(): Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type AlarmModel = Model<IAlarm, {}, IAlarmMethods>;

const alarmSchema = new ConfigurableSchema<IAlarm, AlarmModel, IAlarmMethods>({
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(AlarmStatus),
        default: AlarmStatus.PENDING,
        required: true,
        q: true
    },
    sensorId: {
        type: Schema.Types.ObjectId,
        required: true,
        q: true,
        ref: 'Sensor',
    }
}, {
    methods: {
        toJSON
    },
    timestamps: true,
})

const Alarm = mongoose.model<IAlarm, AlarmModel>('Alarm', alarmSchema);
export const swaggerSchema = mongooseToSwagger(Alarm);

export default Alarm;