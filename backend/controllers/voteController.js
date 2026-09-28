import Vote from "../models/Vote.js";
import Movie from "../models/Movie.js";

// Vote for a movie
export const voteMovie = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

    // Check if user already voted for this movie
    const existingVote = await Vote.findOne({ user: userId, movie: movieId });
    if (existingVote) {
      return res.status(400).json({ message: "You already voted for this movie" });
    }

    // Create vote
    const vote = await Vote.create({ user: userId, movie: movieId });

    res.status(201).json({ message: "Vote registered successfully", vote });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get voting results (Upcoming movies ONLY)
export const getVoteResults = async (req, res) => {
  try {
    const results = await Vote.aggregate([
      {
        $group: {
          _id: "$movie",
          votes: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie"
        }
      },
      { $unwind: "$movie" },
      { $match: { "movie.isUpcoming": true } },
      {
        $project: {
          _id: 0,
          movieId: "$movie._id",
          title: "$movie.title",
          votes: 1
        }
      },
      { $sort: { votes: -1 } }
    ]);

    res.json(results);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all detailed votes (username and movie title)
export const getAllVoteDetails = async (req, res) => {
  try {
    const votes = await Vote.find()
      .populate("user", "name")
      .populate("movie", "title");

    res.json(votes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
