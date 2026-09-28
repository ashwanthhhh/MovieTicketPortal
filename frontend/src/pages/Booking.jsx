import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ---------------- THEATRE MASTER ---------------- */

const theatreMap = {
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

/* ---------------- MOVIE SHOW TIMES ---------------- */

const movieShows = {
  Ghilli: ["10:30 AM", "2:00 PM", "6:30 PM"],
  Mankatha: ["11:00 AM", "3:00 PM", "9:00 PM"],
  Ayan: ["10:45 AM", "2:30 PM", "7:45 PM"],
  Thalapathi: ["11:15 AM", "6:00 PM"],
  Nayakan: ["12:00 PM", "8:30 PM"],
  Polladhavan: ["3:15 PM", "9:45 PM"]
};

/* ---------------- AUTO SHOW MAP ---------------- */

function getTheatresForMovie(location, movieTitle) {
  const allTheatres = theatreMap[location];
  if (!allTheatres || allTheatres.length === 0) return ["PVR Cinemas", "INOX", "AGS"];
  
  let hash = 0;
  for (let i = 0; i < movieTitle.length; i++) {
    hash = movieTitle.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const numTheatres = allTheatres.length;
  const t1 = allTheatres[(hash) % numTheatres];
  const t2 = allTheatres[(hash + 1) % numTheatres];
  const t3 = allTheatres[(hash + 2) % numTheatres];
  
  return Array.from(new Set([t1, t2, t3]));
}

function generateShowMap() {
  const showMap = {};

  Object.keys(theatreMap).forEach(location => {
    showMap[location] = {};

    Object.keys(movieShows).forEach(movie => {
      const selectedTheatres = getTheatresForMovie(location, movie);
      showMap[location][movie] = selectedTheatres.map(theatre => ({
          theatre,
          shows: movieShows[movie]
        }));
    });
  });

  return showMap;
}

const showMap = generateShowMap();

/* ---------------- COMPONENT ---------------- */

function Booking() {

  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>No movie selected</h2>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "12px 30px", background: "var(--accent-primary)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Go to Dashboard</button>
      </div>
    );
  }

  const { movie, location } = state;

  // 🟢 FALLBACK FOR EVENTS/SPORTS/PLAYS
  const defaultShows = ["10:30 AM", "2:30 PM", "6:30 PM", "9:30 PM"];
  const theatresList = getTheatresForMovie(location, movie.title);

  const fallbackTheatres = theatresList.map(theatre => ({
    theatre: typeof theatre === "string" ? theatre : theatre.name || "Cinema",
    shows: defaultShows
  }));

  const theatres = showMap[location]?.[movie.title] || fallbackTheatres;

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>

      {/* PREMIUM HERO HEADER */}
      <div style={{
        height: "400px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* BLURRED BACKGROUND */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${movie.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(40px) brightness(0.4)",
          transform: "scale(1.2)"
        }}></div>

        <button
          onClick={() => navigate(-1)}
          style={{ position: "absolute", top: "30px", left: "30px", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "12px 25px", borderRadius: "30px", cursor: "pointer", backdropFilter: "blur(10px)", fontWeight: "bold", zIndex: 10 }}
        >
          ← Back
        </button>

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", display: "flex", gap: "40px", alignItems: "center", maxWidth: "1200px", width: "100%", padding: "0 40px" }}>
          <img src={movie.img} alt={movie.title} style={{ width: "220px", height: "320px", borderRadius: "16px", objectFit: "cover", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontSize: "3.5rem", marginBottom: "15px", textShadow: "0 5px 15px rgba(0,0,0,0.5)" }}>{movie.title}</h1>
            <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ padding: "6px 15px", background: "var(--accent-primary)", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold" }}>Rating: {movie.rating} / 10</span>
              <span style={{ color: "var(--text-secondary)" }}>{movie.genre} • {movie.language}</span>
            </div>
            <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "600px" }}>Select your preferred cinema and showtime in <span style={{ color: "var(--accent-secondary)", fontWeight: "bold" }}>{location}</span></p>
          </div>
        </div>
      </div>

      {/* THEATRE LIST SECTION */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%", padding: "60px 20px" }}>
        <h2 style={{ marginBottom: "40px", color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "2px", textAlign: "center" }}>Available Cinemas</h2>

        {theatres.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0", background: "var(--bg-secondary)", borderRadius: "20px", border: "1px dashed var(--bg-input)" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>No shows available for this movie in {location}</p>
          </div>
        ) : (
          theatres.map((t, i) => (
            <div key={i} style={{
              background: "var(--bg-secondary)",
              padding: "35px",
              borderRadius: "24px",
              marginBottom: "30px",
              border: "1px solid var(--bg-input)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              transition: "transform 0.2s ease"
            }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{t.theatre}</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--status-success)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Mobile Entry Available</span>
              </div>

              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                {t.shows.map((time, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate("/seats", { state: { movie, theatre: t.theatre, time, location } })}
                    style={{
                      padding: "14px 28px",
                      background: "transparent",
                      border: "1px solid rgba(229, 9, 20, 0.3)",
                      borderRadius: "12px",
                      color: "var(--accent-primary)",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontSize: "1rem"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "var(--accent-primary)";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(229, 9, 20, 0.4)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--accent-primary)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Booking;
