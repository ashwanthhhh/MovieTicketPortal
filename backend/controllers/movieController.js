import Movie from "../models/Movie.js";

// Add new movie (admin)
export const addMovie = async (req, res) => {
  try {
    const { title, genre, mood, date, time, availableSeats, rating, location, theatreName, isCurrent, isUpcoming } = req.body;
    let imageUrl = req.body.image || "";

    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const movie = new Movie({ 
      title, 
      genre, 
      mood, 
      date, 
      time, 
      availableSeats, 
      rating: rating || 0, 
      image: imageUrl, 
      location, 
      theatreName,
      isCurrent: isCurrent === "true" || isCurrent === true,
      isUpcoming: isUpcoming === "true" || isUpcoming === true
    });
    await movie.save();
    res.json({ message: "Movie added", movie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an existing movie (admin)
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, genre, mood, date, time, availableSeats, rating, location, theatreName, isCurrent, isUpcoming } = req.body;

    // Find existing
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    if (title) movie.title = title;
    if (genre) movie.genre = genre;
    if (mood) movie.mood = mood;
    if (date) movie.date = date;
    if (time) movie.time = time;
    if (availableSeats !== undefined) movie.availableSeats = availableSeats;
    if (rating !== undefined) movie.rating = rating;
    if (location !== undefined) movie.location = location;
    if (theatreName !== undefined) movie.theatreName = theatreName;
    if (isCurrent !== undefined) movie.isCurrent = isCurrent === "true" || isCurrent === true;
    if (isUpcoming !== undefined) movie.isUpcoming = isUpcoming === "true" || isUpcoming === true;

    if (req.file) {
      movie.image = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (req.body.image && typeof req.body.image === 'string') {
      movie.image = req.body.image;
    }

    await movie.save();
    res.json({ message: "Movie updated", movie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an existing movie (admin)
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) return res.status(404).json({ message: "Movie not found" });

    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all movies
export const getMovies = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status === "current") query = { isCurrent: true };
    if (status === "upcoming") query = { isUpcoming: true };

    const movies = await Movie.find(query);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
