import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Gamification() {
    const navigate = useNavigate();
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/gamification/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.points !== undefined) {
                    setPoints(data.points);
                }
            } catch (err) {
                console.error("Error fetching points:", err);
            }
        };
        fetchPoints();
    }, []);

    const earnPoints = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/gamification/daily-bonus", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                if (data.points !== undefined) {
                    setPoints(data.points);
                }
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Error claiming bonus:", err);
        }
    };

    return (
        <div style={{
            background: "var(--bg-primary)",
            minHeight: "100vh",
            color: "var(--text-primary)",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* CINEMATIC HEADER */}
            <div style={{
                height: "300px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/gamification-bg.jpg')",
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
                    <h1 style={{ fontSize: "3rem", color: "var(--accent-secondary)", textShadow: "0 0 20px rgba(0, 255, 234, 0.4)", marginBottom: "10px" }}>🎮 CineVerse Rewards</h1>
                    <p style={{ color: "var(--text-secondary)", letterSpacing: "1px" }}>Watch Movies, Earn Coins, Win Rewards.</p>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "-60px", padding: "0 20px" }}>
                <div style={{
                    background: "var(--bg-secondary)",
                    padding: "50px",
                    borderRadius: "28px",
                    textAlign: "center",
                    width: "550px",
                    border: "1px solid var(--bg-input)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    zIndex: 2
                }}>
                    <div style={{ fontSize: "1.3rem", color: "var(--text-muted)", marginBottom: "15px", letterSpacing: "1px", textTransform: "uppercase" }}>Current Balance</div>
                    <div style={{ fontSize: "5rem", fontWeight: "bold", color: "var(--accent-secondary)", marginBottom: "25px", textShadow: "0 0 30px rgba(0, 255, 234, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                        🪙 {points}
                    </div>

                    <div style={{ width: "100%", height: "10px", background: "var(--bg-input)", borderRadius: "5px", marginBottom: "40px", overflow: "hidden", position: "relative" }}>
                        <div style={{ width: `${Math.min((points / 250) * 100, 100)}%`, height: "100%", background: "var(--accent-secondary)", boxShadow: "0 0 20px var(--accent-secondary)", transition: "width 0.5s ease" }}></div>
                    </div>

                    <button
                        onClick={earnPoints}
                        style={{
                            padding: "18px 50px",
                            background: "var(--accent-primary)",
                            border: "none",
                            borderRadius: "40px",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            boxShadow: "0 10px 25px rgba(245, 57, 102, 0.5)",
                            transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        Claim Daily Bonus +5
                    </button>

                    <div style={{ marginTop: "60px", borderTop: "1px solid var(--bg-input)", paddingTop: "40px" }}>
                        <h4 style={{ marginBottom: "25px", color: "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "2px" }}>Elite Status</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
                            <div style={{ flex: 1, opacity: points >= 50 ? 1 : 0.2, textAlign: "center", padding: "15px", background: "rgba(255,255,255,0.05)", borderRadius: "15px", border: points >= 50 ? "1px solid var(--accent-primary)" : "1px solid transparent" }}>
                                <div style={{ fontSize: "2.5rem", marginBottom: "5px" }}>🥉</div>
                                <div style={{ fontSize: "0.75rem", color: "white", fontWeight: "bold" }}>STARTER</div>
                            </div>
                            <div style={{ flex: 1, opacity: points >= 150 ? 1 : 0.2, textAlign: "center", padding: "15px", background: "rgba(255,255,255,0.05)", borderRadius: "15px", border: points >= 150 ? "1px solid gold" : "1px solid transparent" }}>
                                <div style={{ fontSize: "2.5rem", marginBottom: "5px" }}>🥇</div>
                                <div style={{ fontSize: "0.75rem", color: "white", fontWeight: "bold" }}>PRO</div>
                            </div>
                            <div style={{ flex: 1, opacity: points >= 250 ? 1 : 0.2, textAlign: "center", padding: "15px", background: "rgba(255,255,255,0.05)", borderRadius: "15px", border: points >= 250 ? "1px solid var(--accent-secondary)" : "1px solid transparent" }}>
                                <div style={{ fontSize: "2.5rem", marginBottom: "5px" }}>💎</div>
                                <div style={{ fontSize: "0.75rem", color: "white", fontWeight: "bold" }}>LEGEND</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Gamification;
