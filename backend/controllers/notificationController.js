import User from "../models/User.js";

export const getNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Return newest first
        res.json(user.notifications.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const markNotificationsRead = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.notifications.forEach(n => n.read = true);
        await user.save();
        res.json(user.notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
