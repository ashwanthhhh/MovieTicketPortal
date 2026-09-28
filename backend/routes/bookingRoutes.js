import express from "express";
import { createBooking, getMyBookings, transferTicket, getBookedSeatsByMovie } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyBookings);
router.get("/movie/:movieId", protect, getBookedSeatsByMovie); // New route
router.post("/", protect, createBooking);
router.post("/transfer", protect, transferTicket);

export default router;

