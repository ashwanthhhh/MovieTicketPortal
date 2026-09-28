import mongoose from "mongoose";
import Movie from "./models/Movie.js";
import User from "./models/User.js";
import Vote from "./models/Vote.js";

const seedDatabase = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/movieticket");
        console.log("Connected to MongoDB for seeding new features...");

        // 1. Setup Admin user and regular Gamification User
        // Delete users to prevent duplicates during multiple test runs
        await User.deleteMany({ email: { $in: ["admin@movie.com", "gamer@movie.com"] } });
        
        const adminUser = new User({
            name: "Admin User",
            email: "admin@movie.com",
            password: "password123", /* will be hashed by pre save */
            isAdmin: true,
            points: 0
        });
        await adminUser.save();

        const gamificationUser = new User({
            name: "Gamer User",
            email: "gamer@movie.com",
            password: "password123",
            isAdmin: false,
            points: 150, // Reward points hold
            badges: ["Bronze", "Silver"]
        });
        await gamificationUser.save();
        console.log("Admin and Gamification users added to DB.");

        // 2. Setup Movies with Moods
        const movies = await Movie.find();
        if (movies.length > 0) {
            for (let movie of movies) {
                // Determine a simple mood based on genre text for seed data
                if (movie.genre.includes("Happy") || movie.genre.includes("Comedy")) {
                    movie.mood = "Happy";
                } else if (movie.genre.includes("Sad")) {
                    movie.mood = "Sad";
                } else if (movie.genre.includes("Action") || movie.genre.includes("Thriller")) {
                    movie.mood = "Exciting";
                } else {
                    movie.mood = "Neutral";
                }
                await movie.save();
            }
            console.log("Movies updated with 'mood' property.");
        } else {
            console.log("No movies found to update. Run seed.js first if needed.");
        }

        // 3. Setup Voting
        await Vote.deleteMany({});
        if (movies.length > 0) {
            const newVote = new Vote({
                user: gamificationUser._id,
                movie: movies[0]._id
            });
            await newVote.save();
            console.log("Voting data (username and voted movie) added to DB.");
        }

        console.log("Database successfully seeded with new feature records!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDatabase();
