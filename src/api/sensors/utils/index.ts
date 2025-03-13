import { ISensor } from "../model.ts";

// eslint-disable-next-line no-unused-vars
export const toJSON = function(this: ISensor){
    return this.toObject()
}