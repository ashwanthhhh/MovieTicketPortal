import Theatre from "../models/Theatre.js";

// Add new theatre
export const addTheatre = async (req, res) => {
  try {
    const { name, location, facilities, screens } = req.body;
    const theatre = new Theatre({ name, location, facilities, screens });
    await theatre.save();
    res.status(201).json({ message: "Theatre added successfully", theatre });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all theatres
export const getTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find();
    res.json(theatres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a theatre
export const deleteTheatre = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTheatre = await Theatre.findByIdAndDelete(id);
    if (!deletedTheatre) return res.status(404).json({ message: "Theatre not found" });

    res.json({ message: "Theatre deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
