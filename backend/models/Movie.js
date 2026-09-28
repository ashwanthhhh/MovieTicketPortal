import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  mood: String,
  date: String,
  time: String,
  availableSeats: Number,
  location: String,
  theatreName: String,
  image: String,
  isCurrent: { type: Boolean, default: true },
  isUpcoming: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  votesCount: { type: String, default: "0" },
  duration: String,
  language: String
});

export default mongoose.model("Movie", movieSchema);
