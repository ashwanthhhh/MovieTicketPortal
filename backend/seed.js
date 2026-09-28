import mongoose from "mongoose";
import Movie from "./models/Movie.js";
import User from "./models/User.js";

const seedData = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/movieticket");
        console.log("Connected to MongoDB for seeding...");

        // Clear existing movies
        await Movie.deleteMany({});

        const movies = [
            {
                title: "Ghilli",
                image: "/images/ghilli.jpeg",
                rating: 8.7,
                votesCount: "22K+",
                duration: "2h 40m",
                genre: "Action",
                language: "Tamil",
                isCurrent: true,
                availableSeats: 50
            },
            {
                title: "Mankatha",
                image: "/images/mankatha.jpg",
                rating: 8.9,
                votesCount: "30K+",
                duration: "2h 35m",
                genre: "Action Thriller",
                language: "Tamil",
                isCurrent: true,
                availableSeats: 40
            },
            {
                title: "96",
                image: "/images/96.jpg",
                rating: 8.5,
                votesCount: "15K+",
                duration: "2h 38m",
                genre: "Sad Romantic Drama",
                language: "Tamil",
                isCurrent: true,
                availableSeats: 30
            },
            {
                title: "Boss Engira Bhaskaran",
                image: "/images/voting/boss.webp",
                rating: 8.0,
                votesCount: "12K+",
                duration: "2h 20m",
                genre: "Happy Comedy",
                language: "Tamil",
                isCurrent: true,
                availableSeats: 60
            },
            {
                title: "Raja Rani",
                image: "/images/rajarani.jpg",
                rating: 8.4,
                votesCount: "20K+",
                duration: "2h 45m",
                genre: "Romantic Comedy Happy",
                language: "Tamil",
                isCurrent: true,
                availableSeats: 35
            },
            {
                title: "OK Kanmani",
                image: "/images/voting/okkanmani.webp",
                rating: 8.1,
                votesCount: "15K+",
                duration: "2h 18m",
                genre: "Romantic Drama Happy",
                language: "Tamil",
                isCurrent: true,
                availableSeats: 40
            },
            {
                title: "Sivaji: The Boss",
                image: "/images/voting/sivaji.webp",
                rating: 9.0,
                votesCount: "45K+",
                duration: "3h 05m",
                genre: "Action Drama",
                language: "Tamil",
                isUpcoming: true,
                isCurrent: false,
                availableSeats: 0
            },
            {
                title: "Vettaiyaadu Vilaiyaadu",
                image: "/images/voting/vv.webp",
                rating: 8.8,
                votesCount: "32K+",
                duration: "2h 55m",
                genre: "Action Crime Thriller",
                language: "Tamil",
                isUpcoming: true,
                isCurrent: false,
                availableSeats: 0
            },
            {
                title: "Baashha",
                image: "/images/voting/baashha.jpg",
                rating: 9.5,
                votesCount: "100K+",
                duration: "2h 38m",
                genre: "Action Drama",
                language: "Tamil",
                isCurrent: false,
                isUpcoming: true,
                availableSeats: 0
            },
            {
                title: "Vinnaithaandi Varuvaayaa",
                image: "/images/voting/vvv.webp",
                rating: 8.2,
                votesCount: "18K+",
                duration: "2h 40m",
                genre: "Romantic Drama",
                language: "Tamil",
                isUpcoming: true,
                isCurrent: false,
                availableSeats: 0
            }
        ];

        await Movie.insertMany(movies);
        console.log("Database seeded with movies!");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
