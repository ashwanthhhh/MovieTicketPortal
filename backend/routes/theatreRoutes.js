import express from "express";
import { addTheatre, getTheatres, deleteTheatre } from "../controllers/theatreController.js";

const router = express.Router();

router.get("/", getTheatres);
router.post("/", addTheatre);
router.delete("/:id", deleteTheatre);

export default router;
