import { ConfigurableSchema } from "../../utils/lib/mongoose/index.ts";
import mongoose, { Document, Model} from 'mongoose';
import { toJSON } from "./utils/index.ts";

export interface ISensor extends Document{
    name: String
}

interface ISensorMethods{
    toJson(): Record<string, unknown>
}

type SensorModel = Model<ISensor, {}, ISensorMethods>

const sensorSchema = new ConfigurableSchema<ISensor, SensorModel, ISensorMethods>({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: false,
    configuration: {
        methods: {
            toJSON
        }
    }
})

const Sensor = mongoose.model<ISensor, SensorModel>('Sensor', sensorSchema);

export default Sensor;