import mongoose from "mongoose";
const schema = mongoose.Schema;
const lineSchema = new mongoose.Schema({
    masterObjectId : String, 
    lineName: String,
    startX: Number,
    startY: Number,
    endX: Number,
    endY: Number,
    pointNameFrom: String,
    pointNameTo : String,
    angle: Number,
    total_distanceinmm: String,
    total_distanceinpx : String,
})

const LineModel = mongoose.model('lines',lineSchema);
export default LineModel;