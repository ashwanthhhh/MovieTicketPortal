import mongoose from "mongoose";
import Transfer from "../models/Transfer.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Request ticket transfer
export const requestTransfer = async (req, res) => {
  try {
    const { bookingId, fromUserId, toUserEmail } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid Ticket ID format! You must make a new Real Booking to get a valid database ticket ID." });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found in the database. Ensure this ticket exists." });
    }

    if (booking.user.toString() !== fromUserId.toString()) {
      return res.status(403).json({ message: "You do not own this ticket!" });
    }

    const transfer = new Transfer({ booking: bookingId, fromUser: fromUserId, toUserEmail });
    await transfer.save();
    res.json({ message: "Transfer requested", transfer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve transfer (admin)
export const approveTransfer = async (req, res) => {
  try {
    const { transferId } = req.body;
    const transfer = await Transfer.findById(transferId).populate("booking fromUser");
    if (!transfer) return res.status(404).json({ message: "Transfer not found" });

    const newUser = await User.findOne({ email: transfer.toUserEmail });
    if (!newUser) return res.status(404).json({ message: "Recipient not found" });

    // Change booking owner
    const booking = await Booking.findById(transfer.booking._id);
    booking.user = newUser._id;
    await booking.save();

    transfer.status = "approved";
    await transfer.save();

    // Dispatch real-time notifications
    const fromUser = await User.findById(transfer.fromUser._id);
    if (fromUser) {
      fromUser.notifications.push({ message: `Your ticket transfer (ID: ${booking._id.toString().substring(0, 8)}) to ${newUser.email} was successfully approved by Admin!` });
      await fromUser.save();
    }

    newUser.notifications.push({ message: `🎁 You successfully received a new Ticket Transfer! Check your Dashboard.` });
    await newUser.save();

    res.json({ message: "Transfer approved", transfer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all transfers (admin)
export const getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find().populate("booking fromUser");
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get active user's transfers
export const getMyTransfers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const transfers = await Transfer.find({
      $or: [{ fromUser: req.user.id }, { toUserEmail: user.email }]
    }).populate("booking fromUser");
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
