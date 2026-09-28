import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/movieticket")
  .then(async () => {
    console.log("Connected to MongoDB for resetting points");
    // Connect to User model
    const User = mongoose.connection.collection('users');
    const result = await User.updateMany({}, { $set: { points: 0, badges: [] } });
    console.log(`Reset ${result.modifiedCount} users points to 0.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
