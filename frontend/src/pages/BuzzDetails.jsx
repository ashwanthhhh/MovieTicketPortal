import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BuzzDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const story = state?.story;

    if (!story) {
        return (
            <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "white", padding: "40px", textAlign: "center" }}>
                <h2>No story data found</h2>
                <button onClick={() => navigate("/buzz")} style={{ marginTop: "20px", padding: "10px 20px", background: "var(--accent-primary)", border: "none", color: "white", borderRadius: "5px", cursor: "pointer" }}>Back to Buzz</button>
            </div>
        );
    }

    return (
        <div style={{
            background: "var(--bg-primary)",
            minHeight: "100vh",
            color: "var(--text-primary)",
            paddingBottom: "80px"
        }}>
            {/* Header Image Section */}
            <div style={{ position: "relative", width: "100%", height: "500px", background: "#000", overflow: "hidden" }}>
                {/* Blurred Background to fill space */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${story.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(20px) brightness(0.4)",
                    transform: "scale(1.1)"
                }}></div>

                <img
                    src={story.img}
                    alt={story.title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        position: "relative",
                        zIndex: 1
                    }}
                />
                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "150px",
                    background: "linear-gradient(transparent, var(--bg-primary))"
                }}></div>
                <button
                    onClick={() => navigate(-1)}
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
                    ← Back to Buzz
                </button>
            </div>

            {/* Content Section */}
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px", marginTop: "-50px", position: "relative" }}>
                <span style={{
                    background: "var(--accent-secondary)",
                    color: "black",
                    padding: "6px 15px",
                    borderRadius: "5px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                }}>
                    {story.category}
                </span>

                <h1 style={{
                    fontSize: "2.8rem",
                    marginTop: "20px",
                    lineHeight: "1.2",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)"
                }}>
                    {story.title}
                </h1>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "15px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <span>🕒 {story.date}</span>
                    <span>•</span>
                    <span>by Cineverse Editorial</span>
                </div>

                <div style={{
                    marginTop: "40px",
                    fontSize: "1.15rem",
                    lineHeight: "1.8",
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-line"
                }}>
                    {story.content}
                </div>

                <div style={{
                    marginTop: "60px",
                    padding: "30px",
                    background: "var(--bg-secondary)",
                    borderRadius: "20px",
                    textAlign: "center",
                    border: "1px solid var(--bg-input)"
                }}>
                    <h3 style={{ marginBottom: "15px" }}>What do you think?</h3>
                    <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                        <button style={reactionBtn}>🔥 Trending</button>
                        <button style={reactionBtn}>👏 Mind Blown</button>
                        <button style={reactionBtn}>🤔 Interesting</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const reactionBtn = {
    background: "var(--bg-input)",
    border: "1px solid #444",
    color: "white",
    padding: "10px 20px",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s"
};

export default BuzzDetails;
