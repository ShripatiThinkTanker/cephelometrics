import mongoose from "mongoose";
const schema = mongoose.Schema;
const lineSchema = new mongoose.Schema({
  masterObjectId: mongoose.Types.ObjectId,
  distance: String,
  distanceinPx: String,
  left: String,
  top: String,
  angle: String,
  x1: Number,
  y1: Number,
  x2: Number,
  y2: Number,
  id: String,
  x: Object,
});

const LineModel = mongoose.model('lines',lineSchema);
export default LineModel;