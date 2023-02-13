import mongoose from "mongoose";
const pointSchema = new mongoose.Schema({
    masterObjectId : String, 
    pointName: String,
    x: Number,
    y: Number,
    point_name_alias: String,
})

const pointModel = mongoose.model('points',pointSchema);
export default pointModel;