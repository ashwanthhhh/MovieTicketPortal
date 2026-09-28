import express from "express";
import { requestTransfer, approveTransfer, getAllTransfers, getMyTransfers } from "../controllers/transferController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllTransfers);
router.post("/request", requestTransfer);
router.post("/approve", approveTransfer);

router.get("/me", protect, getMyTransfers);

export default router;
