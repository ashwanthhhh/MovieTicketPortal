import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  toUserEmail: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Transfer", transferSchema);
