import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
    const navigate = useNavigate();

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
            {/* HEROBANNER STYLE HEADER */}
            <div style={{
                height: "350px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/about-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}>
                <button
                    onClick={() => navigate("/dashboard")}
                    style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", backdropFilter: "blur(5px)" }}
                >
                    ← Back to Dashboard
                </button>
                <div style={{ textAlign: "center", zIndex: 1 }}>
                    <h1 style={{ fontSize: "3.5rem", color: "var(--accent-primary)", textShadow: "0 0 20px rgba(245, 57, 102, 0.6)", marginBottom: "10px" }}>🎬 CineVerse</h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", letterSpacing: "2px", textTransform: "uppercase" }}>The Ultimate Cinematic Portal</p>
                </div>
            </div>

            <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 20px" }}>
                <section style={{ marginBottom: "50px" }}>
                    <h2 style={{ color: "var(--accent-secondary)", marginBottom: "20px" }}>Our Vision</h2>
                    <p style={{ lineHeight: "1.8", color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                        Cineverse is not just a ticketing platform; it's a gateway to premium entertainment experiences.
                        We believe that the journey to the big screen should be as thrilling as the movie itself.
                        From neon-lit interfaces to community-driven re-releases, we are redefining how fans connect with cinema.
                    </p>
                </section>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "60px" }}>
                    <div style={{ background: "var(--bg-secondary)", padding: "30px", borderRadius: "20px", border: "1px solid var(--bg-input)" }}>
                        <h3 style={{ color: "var(--accent-primary)", marginBottom: "15px" }}>Community First</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Vote for your favorite classics and see them return to theaters. Your voice shapes our schedules.</p>
                    </div>
                    <div style={{ background: "var(--bg-secondary)", padding: "30px", borderRadius: "20px", border: "1px solid var(--bg-input)" }}>
                        <h3 style={{ color: "var(--accent-primary)", marginBottom: "15px" }}>Premium Experience</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Enjoy a seamless, state-of-the-art interface designed for true cinema enthusiasts.</p>
                    </div>
                </div>

                <footer style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", borderTop: "1px solid var(--bg-input)", paddingTop: "30px" }}>
                    <p>© 2026 CineVerse Entertainment. All rights reserved.</p>
                    <p>Designed for the next generation of moviegoers.</p>
                </footer>
            </div>
        </div>
    );
}

export default About;
