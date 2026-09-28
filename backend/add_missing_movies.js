import mongoose from "mongoose";
import Movie from "./models/Movie.js";

const addMissingMovies = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/movieticket");
        console.log("Connected to MongoDB...");

        const missingMovies = [
            {
                title: "Ayan",
                image: "/images/ayan.jpg",
                rating: 8.1,
                votesCount: "10K+",
                duration: "2h 42m",
                genre: "Action Crime",
                language: "Tamil",
                isCurrent: true,
                isUpcoming: false,
                location: "Chennai",
                theatreName: "PVR",
                mood: "Exciting"
            },
            {
                title: "Thalapathi",
                image: "/images/thalapathi.jpeg",
                rating: 8.5,
                votesCount: "25K+",
                duration: "2h 55m",
                genre: "Drama",
                language: "Tamil",
                isCurrent: true,
                isUpcoming: false,
                location: "Madurai",
                theatreName: "Thangam",
                mood: "Emotional"
            },
            {
                title: "Nayakan",
                image: "/images/nayakan.jpeg",
                rating: 9.0,
                votesCount: "30K+",
                duration: "2h 25m",
                genre: "Gangster",
                language: "Tamil",
                isCurrent: true,
                isUpcoming: false,
                location: "Chennai",
                theatreName: "AGS",
                mood: "Intense"
            },
            {
                title: "Polladhavan",
                image: "/images/polladhavan.jpeg",
                rating: 8.2,
                votesCount: "12K+",
                duration: "2h 30m",
                genre: "Action Thriller",
                language: "Tamil",
                isCurrent: true,
                isUpcoming: false,
                location: "Coimbatore",
                theatreName: "KG",
                mood: "Action"
            }
        ];

        for (const movie of missingMovies) {
            const exists = await Movie.findOne({ title: movie.title });
            if (!exists) {
                await Movie.create(movie);
                console.log(`Added: ${movie.title}`);
            } else {
                console.log(`Skipped (already exists): ${movie.title}`);
            }
        }

        console.log("Finished adding missing movies.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

addMissingMovies();
