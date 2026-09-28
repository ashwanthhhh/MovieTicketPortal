import User from "../models/User.js";

/*
  🎯 Rules
  - Every booking → +10 points
  - 50 → Bronze
  - 100 → Silver
  - 200 → Gold
*/

export const updateRewards = async (userId, pointsToAdd = 10, notifyMessage = null) => {
  const user = await User.findById(userId);
  if (!user) return;

  // Add points
  user.points = (user.points || 0) + pointsToAdd;

  // Init badges
  if (!user.badges) user.badges = [];

  // Badge unlock
  if (user.points >= 50 && !user.badges.includes("Bronze")) {
    user.badges.push("Bronze");
  }

  if (user.points >= 100 && !user.badges.includes("Silver")) {
    user.badges.push("Silver");
  }

  if (user.points >= 200 && !user.badges.includes("Gold")) {
    user.badges.push("Gold");
  }

  if (notifyMessage) {
    if (!user.notifications) user.notifications = [];
    user.notifications.push({ message: notifyMessage, date: new Date(), read: false });
  }

  await user.save();
  return user;
};

// @desc award points for movie booking
// @route POST /api/gamification/booking-reward
// @access Private
export const bookingReward = async (req, res) => {
  try {
    const user = await updateRewards(req.user.id);
    res.json({
      message: "Booking Successful! +10 points earned! 🎟️",
      points: user.points,
      badges: user.badges
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Claim daily bonus points
// @route POST /api/gamification/daily-bonus
// @access Private
export const claimDailyBonus = async (req, res) => {
  try {
    const userRecord = await User.findById(req.user.id);
    if (!userRecord) return res.status(404).json({ message: "User not found" });

    if (userRecord.lastBonusClaimAt) {
      const diffHours = (new Date() - userRecord.lastBonusClaimAt) / (1000 * 60 * 60);
      if (diffHours < 24) {
        const remainingHours = Math.ceil(24 - diffHours);
        return res.status(400).json({ message: `You can only claim the daily bonus once every 24 hours. Try again in ${remainingHours} hours.` });
      }
    }

    userRecord.lastBonusClaimAt = new Date();
    await userRecord.save();

    const user = await updateRewards(req.user.id, 5, "Daily bonus claimed! +5 points 🎁");
    res.json({
      message: "Daily bonus claimed! +5 points 🎁",
      points: user.points,
      badges: user.badges
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc redeem points for discount
// @route POST /api/gamification/redeem
// @access Private
export const redeemPoints = async (req, res) => {
  try {
    const { pointsToRedeem } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.points < pointsToRedeem) {
      return res.status(400).json({ message: "Insufficient points" });
    }

    user.points -= pointsToRedeem;
    await user.save();

    res.json({
      message: `Successfully redeemed ${pointsToRedeem} points!`,
      points: user.points
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get user leaderboard
// @route GET /api/gamification/leaderboard
// @access Public or Private
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().select("name points badges").sort({ points: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
