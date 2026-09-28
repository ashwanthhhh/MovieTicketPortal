import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EventDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const event = state?.event || {
        title: "The Messi Experience: A Dream Come True - Mumbai",
        img: "/images/events/Arijit Singh Live.jpg", // Default if none provided
        location: "Century Mills, Mumbai",
        date: "Fri 20 Mar 2026 - Sun 26 Apr 2026",
        price: 999,
        about: "Get ready to get closer than ever before to the magic of Leo Messi with The Messi Experience Interactive. This is an immersive & interactive experience celebrating Leo Messi's life. There are 9 installations throughout the exhibition with a merchandise store."
    };

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", fontFamily: "sans-serif" }}>

            {/* Premium Hero Header */}
            <div style={{ position: "relative", width: "100%", height: "450px", background: "#000", overflow: "hidden" }}>
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${event.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(20px) brightness(0.4)",
                    transform: "scale(1.1)"
                }}></div>

                <img
                    src={event.img}
                    alt={event.title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        position: "relative",
                        zIndex: 1
                    }}
                />
            </div>

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px" }}>
                {/* Left side: About */}
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "15px", color: "var(--text-primary)" }}>{event.title}</h1>

                    <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                        <span style={{ padding: "6px 14px", background: "var(--bg-secondary)", color: "var(--accent-secondary)", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", border: "1px solid var(--bg-input)" }}>Artist Legacy</span>
                        <span style={{ padding: "6px 14px", background: "var(--bg-secondary)", color: "var(--accent-secondary)", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", border: "1px solid var(--bg-input)" }}>Exhibitions</span>
                    </div>

                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "15px", color: "var(--accent-primary)" }}>About The Event</h2>
                    <p style={{ lineHeight: "1.8", color: "var(--text-secondary)", fontSize: "1.05rem" }}>{event.about}</p>
                </div>

                {/* Right side: Info Card */}
                <div style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--bg-input)",
                    borderRadius: "20px",
                    padding: "30px",
                    height: "fit-content",
                    position: "sticky",
                    top: "40px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.5)"
                }}>
                    <div style={{ marginBottom: "25px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
                            <span style={{ fontSize: "1.2rem" }}>📅</span>
                            <span style={{ fontSize: "0.95rem" }}>{event.date}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
                            <span style={{ fontSize: "1.2rem" }}>⏳</span>
                            <span style={{ fontSize: "0.95rem" }}>1 hour 15 minutes</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
                            <span style={{ fontSize: "1.2rem" }}>🔞</span>
                            <span style={{ fontSize: "0.95rem" }}>Age Limit - 2yrs +</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
                            <span style={{ fontSize: "1.2rem" }}>📍</span>
                            <span style={{ fontSize: "0.95rem" }}>{event.location}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid var(--bg-input)", paddingTop: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>₹{event.price} onwards</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--status-success)", fontWeight: "bold" }}>Available Now</div>
                        </div>
                        <button
                            onClick={() => navigate("/event-booking", { state: { event } })}
                            style={{
                                background: "var(--accent-primary)",
                                color: "white",
                                border: "none",
                                padding: "14px 35px",
                                borderRadius: "10px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "1rem",
                                boxShadow: "0 5px 15px rgba(245, 57, 102, 0.4)"
                            }}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate("/events")}
                style={{
                    position: "fixed",
                    top: "30px",
                    left: "30px",
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                    padding: "10px 25px",
                    borderRadius: "30px",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    fontWeight: "bold",
                    zIndex: 1000,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.5)"
                }}
            >
                ← Back to Events
            </button>
        </div>
    );
};

export default EventDetails;
