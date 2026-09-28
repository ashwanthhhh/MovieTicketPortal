import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Profile() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const [stats, setStats] = useState({ points: 0, badges: [] });

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/gamification/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.points !== undefined) {
                    setStats({ points: data.points, badges: data.badges || [] });
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
    }, [user]);

    const handleLogout = () => {
        setUser(null);
        navigate("/");
    };

    if (!user) {
        return (
            <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <h2 style={{ marginBottom: "20px" }}>❌ Please login to view profile</h2>
                <button onClick={() => navigate("/")} style={{ padding: "12px 30px", background: "var(--accent-primary)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Go to Login</button>
            </div>
        );
    }

    const memberStatus = stats.points >= 200 ? "GOLD ELITE" : stats.points >= 100 ? "SILVER PRO" : stats.points >= 50 ? "BRONZE MEMBER" : "ELITE PRO";

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>

            {/* PREMIUM HERO HEADER */}
            <div style={{
                height: "300px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/profile-bg.jpg')",
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
                    <h1 style={{ fontSize: "3.5rem", color: "var(--accent-primary)", textShadow: "0 0 20px rgba(245, 57, 102, 0.6)", marginBottom: "10px" }}>👤 Member Profile</h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", letterSpacing: "2px" }}>Your Cinematic Identity</p>
                </div>
            </div>

            <div style={{ padding: "60px 20px", display: "flex", justifyContent: "center", marginTop: "-100px", position: "relative", zIndex: 10 }}>
                <div style={{
                    background: "var(--bg-secondary)",
                    padding: "50px",
                    borderRadius: "40px",
                    width: "100%",
                    maxWidth: "550px",
                    textAlign: "center",
                    border: "1px solid var(--bg-input)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 30px 60px rgba(0,0,0,0.6)"
                }}>
                    <div style={{
                        width: "180px",
                        height: "180px",
                        borderRadius: "50%",
                        border: "5px solid var(--accent-primary)",
                        padding: "5px",
                        margin: "0 auto 30px",
                        position: "relative",
                        boxShadow: "0 0 40px rgba(245, 57, 102, 0.4)",
                        background: "var(--bg-primary)"
                    }}>
                        <img src="/images/user.png"
                            alt="Profile"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=F53966&color=fff&size=200`; }}
                        />
                    </div>

                    <h3 style={{ fontSize: "2.2rem", marginBottom: "10px", fontWeight: "bold", color: "white" }}>{user.name}</h3>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "40px", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--status-success)" }}>●</span> {user.email}
                    </p>

                    <div style={{ width: "100%", textAlign: "left", background: "rgba(0,0,0,0.3)", padding: "30px", borderRadius: "24px", marginBottom: "40px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                            <span style={{ color: "var(--text-muted)", fontSize: "1rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Member Status</span>
                            <span style={{ color: "var(--status-success)", fontSize: "1rem", fontWeight: "bold" }}>{memberStatus}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                            <span style={{ color: "var(--text-muted)", fontSize: "1rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>CineCoins</span>
                            <span style={{ color: "var(--accent-secondary)", fontSize: "1rem", fontWeight: "bold" }}>⭐ {stats.points}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-muted)", fontSize: "1rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Badges</span>
                            <span style={{ color: "#fff", fontSize: "1rem" }}>{stats.badges.join(", ") || "None"}</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                        <button onClick={() => navigate("/gamification")} style={{
                            flex: 1,
                            padding: "18px",
                            background: "var(--accent-primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "15px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            boxShadow: "0 10px 20px rgba(245, 57, 102, 0.3)",
                            transition: "all 0.3s"
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            View Rewards
                        </button>

                        <button onClick={handleLogout} style={{
                            flex: 1,
                            padding: "18px",
                            background: "rgba(255,255,255,0.05)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "15px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            transition: "all 0.3s"
                        }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
