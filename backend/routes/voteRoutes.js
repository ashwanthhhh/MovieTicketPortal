import express from "express";
import { voteMovie, getVoteResults, getAllVoteDetails } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🗳️ Cast a vote for a movie
router.post("/", protect, voteMovie);

// 📊 Get voting results
router.get("/results", protect, getVoteResults);

// 📋 Get all votes detail (username and movie)
router.get("/list", protect, getAllVoteDetails);

export default router;
