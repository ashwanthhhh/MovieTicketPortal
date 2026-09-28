import React from "react";
import { useNavigate } from "react-router-dom";

const Buzz = () => {
    const navigate = useNavigate();

    const news = [
        {
            title: "\"Leo\" Sequel Confirmed by Lokesh Kanagaraj?",
            date: "2 Hours Ago",
            img: "/images/upcoming/leo 2.jpg",
            category: "Trending",
            content: "Lokesh Kanagaraj has finally broken the silence regarding the much-anticipated sequel to 'Leo'. In a recent interview, the director hinted that the script for Part 2 is already in the works.\n\nFans of the LCU (Lokesh Cinematic Universe) have been theorizing about the connection between 'Leo' and other films like 'Vikram' and 'Kaithi'. It seems the sequel will dive deeper into Leo Das's past and his eventual collision with other cinematic titans.\n\nProduction is expected to begin late next year, with Thalapathy Vijay returning to reprise his iconic role."
        },
        {
            title: "Rajinikanth's \"Coolie\" First Look Teaser Breaks Records",
            date: "5 Hours Ago",
            img: "/images/buzz/coolie.jpg",
            category: "New Release",
            content: "Superstar Rajinikanth's 'Coolie' teaser has practically set the internet on fire, crossing 50 million views within the first 12 hours. Directed by Lokesh Kanagaraj, the teaser showcases the Superstar in a rugged, monochromatic avatar.\n\nAnirudh Ravichander's electrifying background score and the high-octane action choreography have been praised by critics and fans alike. The film appears to be a high-stakes heist thriller set against the backdrop of a gold smuggling ring.\n\nThis marks the first collaboration between Rajinikanth and Lokesh, making it the most awaited project of the southern film industry."
        },
        {
            title: "Suriya's \"Kanguva\" Post-Production in Full Swing",
            date: "1 Day Ago",
            img: "/images/upcoming/kanguva.jpg",
            category: "Update",
            content: "Prepare for an epic historical fantasy! Suriya's 'Kanguva' is currently in its final stages of post-production. The VFX team, working across three different continents, is reportedly delivering visuals that have never been seen before in Indian cinema.\n\nSuriya will be seen in multiple roles across different timelines, including a fierce warrior from a thousand years ago. The film's producer shared that the movie will be released in over 20 languages across 3000+ screens globally.\n\nComposer Devi Sri Prasad has already completed the first half of the background score, promising a cinematic experience that will be both primal and grand."
        }
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
                background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/buzz-bg.jpg')",
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
                    <h1 style={{ fontSize: "3.5rem", color: "var(--accent-primary)", textShadow: "0 0 20px rgba(245, 57, 102, 0.6)", marginBottom: "10px" }}>⚡ CineVerse Buzz</h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", letterSpacing: "2px" }}>Latest News from the Movie World</p>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%", maxWidth: "1000px", margin: "60px auto", padding: "0 20px" }}>
                {news.map((n, i) => (
                    <div key={i} style={{
                        display: "flex",
                        gap: "35px",
                        background: "var(--bg-secondary)",
                        padding: "30px",
                        borderRadius: "24px",
                        alignItems: "center",
                        border: "1px solid var(--bg-input)",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                        transition: "transform 0.3s ease"
                    }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <img src={n.img} alt={n.title} style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "16px", boxShadow: "0 0 20px rgba(0,0,0,0.4)" }} />
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: "0.8rem", background: "rgba(245, 57, 102, 0.1)", color: "var(--accent-primary)", padding: "6px 14px", borderRadius: "20px", textTransform: "uppercase", fontWeight: "bold", border: "1px solid rgba(245, 57, 102, 0.3)" }}>{n.category}</span>
                            <h3 style={{ margin: "20px 0 12px 0", fontSize: "1.6rem", lineHeight: "1.3", fontWeight: "bold" }}>{n.title}</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
                                <span>🕒</span>
                                <span>{n.date}</span>
                            </div>
                            <button
                                onClick={() => navigate("/buzz-details", { state: { story: n } })}
                                style={{
                                    background: "transparent",
                                    border: "1px solid var(--accent-primary)",
                                    color: "var(--accent-primary)",
                                    padding: "10px 25px",
                                    borderRadius: "10px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = "var(--accent-primary)";
                                    e.currentTarget.style.color = "white";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "var(--accent-primary)";
                                }}
                            >
                                Read Full Story ›
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Buzz;
