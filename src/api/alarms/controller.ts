import { generateControllers } from "../../utils/lib/generator/index.ts";
import Alarm from "./model.ts";

const actions = generateControllers(Alarm, "alarms");

export { actions };