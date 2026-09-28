import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { claimDailyBonus, bookingReward, redeemPoints, getLeaderboard } from "../controllers/gamificationController.js";

const router = express.Router();

// GET current user points & badges
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("points badges name lastBonusClaimAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      points: user.points,
      badges: user.badges,
      lastBonusClaimAt: user.lastBonusClaimAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST claim daily bonus
router.post("/daily-bonus", protect, claimDailyBonus);

// POST booking reward
router.post("/booking-reward", protect, bookingReward);

// POST redeem points
router.post("/redeem", protect, redeemPoints);

// GET leaderboard
router.get("/leaderboard", getLeaderboard);

export default router;
