import { generateControllers } from "../../utils/lib/generator/index.ts";
import { Request, Response } from "express"
import Sensor, { ISensor } from "./model.ts"

const actions = generateControllers(Sensor, "sensor");

export { actions }

