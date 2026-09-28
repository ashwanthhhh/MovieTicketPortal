import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import gamificationRoutes from "./routes/gamificationRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import theatreRoutes from "./routes/theatreRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect("mongodb://127.0.0.1:27017/movieticket")
  .then(() => console.log("MongoDB Connected"));

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
