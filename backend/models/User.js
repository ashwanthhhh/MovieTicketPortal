import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  notifications: {
    type: [{
      message: String,
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }],
    default: []
  },
  lastBonusClaimAt: { type: Date }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
