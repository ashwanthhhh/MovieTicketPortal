import express from "express";
import { handleAIChat } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// AI Chat is protected as it might use user context in the future
router.post("/chat", protect, handleAIChat);

export default router;
