import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Movies = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [points, setPoints] = useState(0);
  const [filter, setFilter] = useState("All");
  const [nowShowing, setNowShowing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/gamification/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.points !== undefined) setPoints(data.points);
      } catch (err) {
        console.error("Error fetching points:", err);
      }
    };
    fetchPoints();

    // Fetch Current Movies
    fetch("http://localhost:5000/api/movies?status=current")
      .then(res => res.json())
      .then(data => setNowShowing(data.map(m => ({ ...m, img: m.image || m.img }))))
      .catch(err => console.error("Error fetching current movies:", err));

    // Fetch Upcoming Movies
    fetch("http://localhost:5000/api/movies?status=upcoming")
      .then(res => res.json())
      .then(data => setUpcoming(data.map(m => ({ ...m, img: m.image || m.img }))))
      .catch(err => console.error("Error fetching upcoming movies:", err));
  }, []);

  const filteredShowing = filter === "All"
    ? nowShowing
    : nowShowing.filter(m => m.genre && m.genre.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column" }}>

      {/* HEROBANNER STYLE HEADER */}
      <div style={{
        height: "350px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/movies-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", backdropFilter: "blur(5px)" }}
        >
          ← Dashboard
        </button>

        <div style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "20px", alignItems: "center" }}>
          {user && (
            <div
              onClick={() => navigate("/gamification")}
              style={{
                background: "rgba(0, 255, 234, 0.1)",
                color: "var(--accent-secondary)",
                padding: "8px 15px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                border: "1px solid rgba(0, 255, 234, 0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backdropFilter: "blur(5px)"
              }}
            >
              🪙 {points} CineCoins
            </div>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "3.5rem", color: "var(--accent-primary)", marginBottom: "10px" }}>CineVerse Movies</h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", letterSpacing: "2px", marginBottom: "30px" }}>Experience the Magic of the Big Screen</p>

          <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
            {["All", "Sad", "Happy", "Romantic", "Action"].map((mood) => (
              <button
                key={mood}
                onClick={() => setFilter(mood)}
                style={{
                  background: filter === mood ? "var(--accent-primary)" : "rgba(0,0,0,0.5)",
                  color: "white",
                  border: filter === mood ? "none" : "1px solid rgba(255,255,255,0.2)",
                  padding: "8px 25px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backdropFilter: "blur(5px)"
                }}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "60px 20px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* NOW SHOWING */}
        <h2 style={{ color: "var(--accent-primary)", marginBottom: "40px", fontSize: "2.2rem", textTransform: "uppercase", letterSpacing: "2px", textAlign: "center" }}>Now Showing</h2>
        <div style={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "center",
          gap: "25px",
          marginBottom: "80px",
          overflowX: "auto",
          padding: "20px",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--accent-primary) transparent"
        }}>
          {filteredShowing.map((m, i) => (
            <div key={i} style={{
              flex: "0 0 auto",
              width: "220px",
              background: "var(--bg-secondary)",
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid var(--bg-input)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              transition: "transform 0.3s ease"
            }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <img src={m.img} alt={m.title} style={{ width: "100%", height: "330px", objectFit: "cover", objectPosition: "center" }} />
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{m.genre}</span>
                  <span style={{ color: "gold", fontWeight: "bold", fontSize: "0.8rem" }}>⭐ {m.rating}</span>
                </div>
                <button
                  onClick={() => navigate("/booking", { state: { movie: m, location: "Chennai" } })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "var(--accent-primary)",
                    border: "none",
                    borderRadius: "10px",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    boxShadow: "0 5px 15px rgba(229, 9, 20, 0.4)",
                    transition: "all 0.2s"
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* UPCOMING */}
        <h2 style={{ color: "var(--accent-secondary)", marginBottom: "40px", fontSize: "2.2rem", textTransform: "uppercase", letterSpacing: "2px", textAlign: "center" }}>Coming Soon</h2>
        <div style={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "center",
          gap: "25px",
          overflowX: "auto",
          padding: "20px",
          scrollbarWidth: "none"
        }}>
          {upcoming.map((m, i) => (
            <div key={i} style={{
              flex: "0 0 auto",
              width: "200px",
              background: "var(--bg-secondary)",
              padding: "15px",
              borderRadius: "18px",
              border: "1px solid var(--bg-input)",
              transition: "all 0.3s ease",
              opacity: 0.8
            }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = "var(--accent-secondary)"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.borderColor = "var(--bg-input)"; }}
            >
              <div style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}>
                <img src={m.img} alt={m.title} style={{ width: "100%", height: "300px", objectFit: "cover", objectPosition: "center", filter: "grayscale(100%) brightness(0.7)" }} />
                <div style={{ position: "absolute", top: "10px", right: "10px", background: "var(--accent-secondary)", color: "black", padding: "4px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "bold" }}>{m.date || "Coming Soon"}</div>
              </div>
              <h3 style={{ marginTop: "15px", fontSize: "1rem", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</h3>
              <button style={{
                marginTop: "12px",
                width: "100%",
                padding: "8px",
                background: "transparent",
                border: "1px solid var(--accent-secondary)",
                borderRadius: "8px",
                color: "var(--accent-secondary)",
                fontWeight: "bold",
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}>Notify Me</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movies;
