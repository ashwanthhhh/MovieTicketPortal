import mongoose from "mongoose";
import Movie from "./models/Movie.js";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/movieticket");
        console.log("MongoDB Connected for Seeding...");

        // Check if the movie already exists to avoid duplicates
        const existing = await Movie.findOne({ 
            title: "Thalapathi", 
            location: "Perambalur", 
            theatreName: "Ram Theatre",
            time: "6:00 PM"
        });

        if (existing) {
            console.log("Test data already exists. Skipping.");
            process.exit();
        }

        const thalapathi = {
            title: "Thalapathi",
            genre: "Drama Action",
            mood: "Emotional",
            date: "Today",
            time: "6:00 PM",
            availableSeats: 50,
            location: "Perambalur",
            theatreName: "Ram Theatre",
            image: "/images/thalapathi.jpeg",
            isCurrent: true,
            isUpcoming: false,
            rating: 8.5,
            votesCount: "25K+",
            duration: "2h 55m",
            language: "Tamil"
        };

        await Movie.create(thalapathi);
        console.log("✅ Seeded 'Thalapathi' in 'Perambalur Ram Theatre' @ 6:00 PM");
        
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seed();
