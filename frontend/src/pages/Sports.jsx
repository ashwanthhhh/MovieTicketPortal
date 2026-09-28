import React from "react";
import { useNavigate } from "react-router-dom";

const Sports = () => {
    const navigate = useNavigate();

    const sports = [
        { title: "IPL 2026: IPL Final", date: "10 Apr", location: "Chepauk, Chennai", img: "/images/sports/ipl.jpg", about: "The biggest match of the year! Witness the IPL 2026 Grand Final live at the iconic Chepauk stadium.", price: 1500 },
        { title: "ISL Final", date: "15 Mar", location: "Goa", img: "/images/sports/isl.jpg", about: "The battle for supremacy in Indian football reaches its climax. Catch the intense action live in Goa.", price: 800 },
        { title: "Pro Kabaddi League", date: "20 Feb", location: "Mumbai", img: "/images/sports/kabaddi.jpg", about: "Experience the adrenaline-pumping world of Pro Kabaddi. Watch the best raiders and defenders in action.", price: 500 }
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
                background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/sports-bg.jpg')",
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
                    <h1 style={{ fontSize: "3.5rem", color: "var(--accent-primary)", textShadow: "0 0 20px rgba(245, 57, 102, 0.6)", marginBottom: "10px" }}>🏆 CineVerse Sports</h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", letterSpacing: "2px" }}>The Ultimate Pitch for Fans</p>
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
                {sports.map((s, i) => (
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
                        <img src={s.img} alt={s.title} style={{ width: "100%", height: "330px", objectFit: "cover", objectPosition: "center" }} />
                        <div style={{ padding: "20px" }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "5px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</h3>
                            <p style={{ color: "var(--text-secondary)", marginBottom: "15px", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>📍 {s.location} • 🗓️ {s.date}</p>
                            <button
                                onClick={() => navigate("/sports-details", { state: { sport: s } })}
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
                                Book Seats
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sports;
