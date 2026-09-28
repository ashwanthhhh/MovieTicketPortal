import { GoogleGenerativeAI } from "@google/generative-ai";
import Movie from "../models/Movie.js";
import Booking from "../models/Booking.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE"
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

/**
 * @desc Handle AI Chat queries with Gemini (ChatGPT-like) and Smart Query fallback
 */
export const handleAIChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "No message provided" });

        // If Gemini is configured, use the LLM
        if (genAI) {
            return await handleGeminiChat(message, res);
        }

        // Otherwise, fallback to the optimized smart query logic
        return await handleSmartQueryFallback(message, res);

    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ message: "Server error in AI processing" });
    }
};

/**
 * 🚀 High-End Gemini Integration (ChatGPT-like)
 */
async function handleGeminiChat(message, res) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    });

    // 1. Fetch Real-Time Context
    const movies = await Movie.find({ isCurrent: true });
    const movieData = movies.map(m => 
        `- ${m.title} is at ${m.theatreName} (${m.location}) at ${m.time}. Available Seats: ${m.availableSeats}. ID: ${m._id}`
    ).join("\n");

    const systemPrompt = `
You are **CineVerse AI**, a premium, high-end movie assistant.
You work like ChatGPT but you have SPECIFIC knowledge about the CineVerse portal.

**CURRENT MOVIES IN DATABASE:**
${movieData}

**RULES:**
1. If users ask about "Ram Theatre", "Perambalur", or "Thalapathi", use the data above.
2. If seats like A1, A2 are requested, tell them you'll verify the booking status (simulate a check if you can't see Bookings directly, but you know the total 'Available Seats').
3. **TANGLISH**: If the user uses Tanglish (Tamil in English script), you MUST reply in natural, helpful Tanglish.
4. **GENERAL KNOWLEDGE**: Act like a normal ChatGPT for things like movie trivia, actors (Vijay, Ajith, etc.), and general chat.
5. Tone: Helpful, cinematic, and premium.

Respond to this message: "${message}"
`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const reply = response.text();

    return res.json({ reply });
}

/**
 * 🛡️ Smart Query Fallback (Keyword based)
 */
async function handleSmartQueryFallback(message, res) {
    const lowerMsg = message.toLowerCase();
    const isTanglish = /irka|iruka|iruku|panna|ah|la|nnu|enaku|solunga|undula|padam|vanga/.test(lowerMsg);
    
    const seatMatches = message.match(/([a-z]\d+)/gi);
    const requestedSeats = seatMatches ? seatMatches.map(s => s.toUpperCase()) : [];

    let movieTitle = null;
    const movieMarkers = ["movie", "film", "padam", "show", "shoe"];
    for (const marker of movieMarkers) {
        const regex = new RegExp(`(?:${marker})\\s+([\\w\\s]+?)(?:\\s+at|\\s+in|\\s+is|\\s+la|\\s+undula|\\.|$)|([\\w\\s]+?)\\s+(?:${marker})`, "i");
        const match = lowerMsg.match(regex);
        if (match) {
            movieTitle = (match[1] || match[2]).trim();
            break;
        }
    }

    if (movieTitle) {
      const titleMatches = await Movie.find({ title: { $regex: movieTitle, $options: "i" } });

      if (titleMatches.length > 0) {
        const selectedMovie = titleMatches[0];
        const bookings = await Booking.find({ movie: selectedMovie._id });
        const allBookedSeats = bookings.reduce((acc, b) => acc.concat(b.seats), []);

        let seatFeedback = "";
        if (requestedSeats.length > 0) {
          const results = requestedSeats.map(s => {
            const isBooked = allBookedSeats.includes(s);
            return `**${s}** is ${isBooked ? (isTanglish ? "already book aayiruchu ❌" : "booked ❌") : (isTanglish ? "available ah thaan iruku ✅" : "available ✅")}`;
          });
          seatFeedback = `\n\nChecking seats: ${results.join(", ")}.`;
        }

        return res.json({
            reply: isTanglish
              ? `🎬 **${selectedMovie.title}** padam **${selectedMovie.theatreName}** (${selectedMovie.location}) la **${selectedMovie.time}** show ku available ah iruku! Innum **${selectedMovie.availableSeats}** seats balance iruku.${seatFeedback}`
              : `🎬 **${selectedMovie.title}** is available at **${selectedMovie.theatreName}** (${selectedMovie.location}) at **${selectedMovie.time}**. There are **${selectedMovie.availableSeats}** seats left.${seatFeedback}`
        });
      }
    }

    // Default Fallback
    return res.json({ 
      reply: isTanglish 
        ? "Puriyala... Vera yethachu help panna mudiyuma? Padam name illana theatre name solunga, naan check panni solren! (Tip: Gemini API key set panna innum super ah chat pannuven!)"
        : "I'm not sure I understood that. Try asking about a movie title or theatre name! (Tip: Set a Gemini API key for a full ChatGPT experience!)" 
    });
}
