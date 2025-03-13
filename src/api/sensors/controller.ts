import { generateControllers } from "../../utils/lib/generator/index.ts";
import Sensor from "./model.ts"

const actions = generateControllers(Sensor, "sensor");

export { actions }

