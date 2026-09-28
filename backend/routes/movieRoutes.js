import express from "express";
import { getMovies, addMovie, updateMovie, deleteMovie } from "../controllers/movieController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getMovies);
router.post("/", upload.single('image'), addMovie);
router.put("/:id", upload.single('image'), updateMovie);
router.delete("/:id", deleteMovie);

export default router;
