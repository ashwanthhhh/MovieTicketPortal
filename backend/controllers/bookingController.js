import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import { updateRewards } from "./gamificationController.js";

// Create a booking (after mock payment)
export const createBooking = async (req, res) => {
  try {
    const { movieId, seats } = req.body;
    const userId = req.user.id;

    // Find movie
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // Safely parse seats into total seat reduction count
    let seatCount = Array.isArray(seats) ? seats.length : (Number(seats) || 1);

    // Check seat availability
    if (movie.availableSeats < seatCount) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Reduce seats
    movie.availableSeats -= seatCount;
    await movie.save();

    // Create booking
    const booking = await Booking.create({
      user: userId,
      movie: movieId,
      seats: Array.isArray(seats) ? seats : [],
      seatsBooked: seatCount
    });

    // 🎯 Gamification: Add points & badges
    const user = await updateRewards(userId, seatCount * 10);

    res.status(201).json({
      message: "Booking successful! Points & badges updated",
      booking,
      points: user.points,
      badges: user.badges
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("movie", "title date time image genre");
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Transfer ticket to another user
export const transferTicket = async (req, res) => {
  try {
    const { bookingId, toUserId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Transfer ownership
    booking.user = toUserId;
    await booking.save();

    res.json({ message: "Ticket transferred successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all booked seats for a movie
export const getBookedSeatsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const bookings = await Booking.find({ movie: movieId });
    
    // Flatten all seats arrays into a single array
    const bookedSeats = bookings.reduce((acc, booking) => {
      return acc.concat(booking.seats);
    }, []);

    // Remove duplicates (though there shouldn't be any in a perfect system)
    const uniqueBookedSeats = [...new Set(bookedSeats)];

    res.json(uniqueBookedSeats);
  } catch (error) {
    console.error("Error fetching booked seats:", error);
    res.status(500).json({ message: "Server error" });
  }
};
