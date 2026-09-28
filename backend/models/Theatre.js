import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  facilities: { type: [String], default: [] },
  screens: { type: Number, default: 1 }
});

export default mongoose.model("Theatre", theatreSchema);
