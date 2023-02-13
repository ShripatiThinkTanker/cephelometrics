import mongoose from "mongoose";
import * as config from "../config/config.json";
export const connection = async()=> {
    await mongoose.connect(config.mongooseUrl.serverUrl + "/"+config.mongooseUrl.db).then(res => console.log("Connection made Successfully")).catch(err => console.log(err));
}