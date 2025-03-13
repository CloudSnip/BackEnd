import { ConfigurableSchema } from "../../utils/lib/mongoose/index.ts";
import { toJSON } from "./utils/index.ts";

import mongooseToSwagger from 'mongoose-to-swagger';
import mongoose, { Document, Model} from 'mongoose';

export interface ISensor extends Document{
    name: string
}

interface ISensorMethods{
    toJson(): Record<string, unknown>
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type SensorModel = Model<ISensor, {}, ISensorMethods>

const sensorSchema = new ConfigurableSchema<ISensor, SensorModel, ISensorMethods>({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    configuration: {
        methods: {
            toJSON
        }
    }
})

const Sensor = mongoose.model<ISensor, SensorModel>('Sensor', sensorSchema);
export const swaggerSchema = mongooseToSwagger(Sensor);

export default Sensor;