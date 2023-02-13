import mongoose from "mongoose";
const schema = mongoose.Schema;
const angleSchema = new mongoose.Schema({
    masterObjectId : String,
    angle_calculated: String,
    endPointX : Number,
    endPointY : Number,
    startPointX : Number,
    startPointY : Number,

})

const AngleModel = mongoose.model('angles',angleSchema);
export default AngleModel;