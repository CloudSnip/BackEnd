import { generateControllers } from "../../utils/lib/generator/index.ts";
import Measurements from "./model.ts"

const actions = generateControllers(Measurements, "measurements");

export { actions }

