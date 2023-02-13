import mongoose from "mongoose";
const schema = mongoose.Schema;
const angleSchema = new mongoose.Schema({
  masterObjectId: mongoose.Types.ObjectId,
  id: Number,
  description: String,
  mean: Number,
  deviation: Number,
  value: String,
  interpretation: String,
});

const AngleModel = mongoose.model('angles',angleSchema);
export default AngleModel;