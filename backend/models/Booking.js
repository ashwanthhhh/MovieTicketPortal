import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  seats: { type: [String], default: [] },
  seatsBooked: Number,
  totalAmount: Number,
  discountApplied: Number,
  status: { type: String, enum: ["pending", "paid"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
