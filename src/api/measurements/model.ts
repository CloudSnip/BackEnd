import { ConfigurableSchema } from "../../utils/lib/mongoose/index.ts";
import mongoose, { Document, Model } from 'mongoose';
import { Schema } from "mongoose";
import { parseMessage, toJSON } from "./utils/index.ts";

export interface IMeasurement extends Document {
    timestamp: Schema.Types.Date
    deviceId: Schema.Types.ObjectId
    humidity: Schema.Types.Double
    temperature: Schema.Types.Double
}

interface IMeasurementMetods {
    toJson(): Record<string, unknown>
    // eslint-disable-next-line no-unused-vars
    parseMessage(message: string): Promise<IMeasurement>
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type MeasurementModel = Model<IMeasurement, {}, IMeasurementMetods>

const measurementSchema = new ConfigurableSchema<IMeasurement, MeasurementModel, IMeasurementMetods>({
    timestamp: {
        type: Schema.Types.Date,
        required: true,
        q: true
    },
    deviceId: {
        type: Schema.Types.ObjectId,
        required: true,
        q: true
    },
    humidity: {
        type: Schema.Types.Double,
        required: true,
        q: true
    },
    temperature: {
        type: Schema.Types.Double,
        required: true,
        q: true
    }

}, {
    methods: {
        toJSON
    },
    statics: {
        parseMessage
    },
    timestamps: false,
    configuration: {
        indexes: [
            {
                fields: {deviceId: 1},
                options: { unique: false }
            }
        ],
        methods:{
            toJSON
        }
    }
})

const Measurement = mongoose.model<IMeasurement, MeasurementModel>('Measurament', measurementSchema);

export default Measurement;