import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie"
  }
});

export default mongoose.model("Vote", voteSchema);
