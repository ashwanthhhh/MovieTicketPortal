import React from "react";
import { useNavigate } from "react-router-dom";

const Plays = () => {
    const navigate = useNavigate();

    const plays = [
        { title: "Mughal-e-Azam", date: "Every Weekend", location: "NCPA, Mumbai", img: "/images/plays/mughaleazam.webp", about: "The timeless love story of Salim and Anarkali, brought to life in a grand theatrical production.", price: 1200 },
        { title: "Hamlet", date: "18 Nov", location: "Bangalore Auditorium", img: "/images/plays/hamlet.webp", about: "Shakespeare's masterpiece of betrayal and revenge, performed by a world-class cast.", price: 600 },
        { title: "Ponniyin Selvan Play", date: "02 Dec", location: "Chennai Trade Centre", img: "/images/plays/ps1.jpg", about: "The epic Chola saga unfolds on stage with breathtaking visuals and powerful performances.", price: 900 }
    ];

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column" }}>

            {/* HEROBANNER STYLE HEADER */}
            <div style={{
                height: "350px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/plays-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}>
                <button
                    onClick={() => navigate("/dashboard")}
                    style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", backdropFilter: "blur(5px)" }}
                >
                    ← Dashboard
                </button>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: "3.5rem", color: "var(--accent-primary)", textShadow: "0 0 20px rgba(245, 57, 102, 0.6)", marginBottom: "10px" }}>🎭 CineVerse Plays</h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", letterSpacing: "2px" }}>Where Art Meets Emotion</p>
                </div>
            </div>

            <div style={{
                display: "flex",
                flexWrap: "nowrap",
                gap: "25px",
                justifyContent: "center",
                padding: "40px 20px",
                maxWidth: "1400px",
                margin: "0 auto",
                overflowX: "auto",
                scrollbarWidth: "none"
            }}>
                {plays.map((p, i) => (
                    <div key={i} style={{
                        flex: "0 0 auto",
                        width: "220px",
                        background: "var(--bg-secondary)",
                        borderRadius: "18px",
                        overflow: "hidden",
                        border: "1px solid var(--bg-input)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                        transition: "transform 0.3s ease"
                    }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        <img src={p.img} alt={p.title} style={{ width: "100%", height: "330px", objectFit: "cover", objectPosition: "center" }} />
                        <div style={{ padding: "20px" }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "5px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</h3>
                            <p style={{ color: "var(--text-secondary)", marginBottom: "15px", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>📍 {p.location} • 🗓️ {p.date}</p>
                            <button
                                onClick={() => navigate("/plays-details", { state: { play: p } })}
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
                                    boxShadow: "0 5px 15px rgba(245, 57, 102, 0.4)",
                                    transition: "all 0.2s"
                                }}
                            >
                                Book Tickets
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plays;
