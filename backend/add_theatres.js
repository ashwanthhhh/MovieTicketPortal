import mongoose from "mongoose";
import Theatre from "./models/Theatre.js";

const theatreData = {
    Chennai: ["PVR", "INOX", "AGS", "Rohini", "Escape", "Kamala", "Albert", "Sangam", "Woodlands", "Udhayam"],
    Coimbatore: ["KG", "Fun Mall", "Broadway", "Archana", "PVR Cinema", "Karpagam Theatre", "Brookefields Mall"],
    Madurai: ["Thangam", "Guru", "Mathi", "Vetri Cinema", "INOX"],
    Trichy: ["LA", "Sona Mina", "Megastar", "Ramba", "Mariyam"],
    Ariyalur: ["Sri Theatre", "Mahasakthi Talkies", "CR Cinema Palace"],
    Perambalur: ["Ram Theatre", "Raja Theatre"],
    Dindigul: ["Aarthi", "Rajendra", "CINE LOUNGE"],
    Thanjavur: ["Vijaya", "Rani", "Vetri Cinemas"],
    Theni: ["Vasanth", "MSP Theatre", "Lucky cinemas"],
    Villuppuram: ["Kannan", "Janas"],
    Tiruppur: ["Usha", "Sangeetha"],
    Tirunelveli: ["PSS", "Central"],
    Tenkasi: ["Thai", "PSS Multiplex"],
    Salem: ["ARR", "KS"],
    Namakkal: ["LMR", "KS CINEPLEX"],
    Nagapattinam: ["Raja", "Devi Cinemas"],
    Mayiladuthurai: ["Pearless", "Vijaya Theatre"],
    Karur: ["Kavithalaya", "Kalaiarangam Kavithalaya"],
    Kanchipuram: ["Babu", "Siva Aruna"],
    Erode: ["Abirami", "Royal"]
};

const seedTheatres = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/movieticket");
        console.log("Connected to MongoDB for seeding full theatre list...");

        // Clear existing theatres
        await Theatre.deleteMany({});

        const theatresToInsert = [];
        
        for (const [location, names] of Object.entries(theatreData)) {
            for (const name of names) {
                theatresToInsert.push({
                    name: name,
                    location: location,
                    facilities: ["Digital Sound", "Standard Seating"],
                    screens: 1
                });
            }
        }

        await Theatre.insertMany(theatresToInsert);
        console.log(`Database seeded with ${theatresToInsert.length} theatres across ${Object.keys(theatreData).length} locations!`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedTheatres();
