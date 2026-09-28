import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ movies }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide enabled (Netflix style)
    useEffect(() => {
        if (!movies || movies.length === 0) return;

        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, movies]);


    const handleNext = () => {
        if (!movies || movies.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    };

    const handlePrev = () => {
        if (!movies || movies.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1));
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    if (!movies || movies.length === 0) {
        return null;
    }

    const safeIndex = currentIndex >= movies.length ? 0 : currentIndex;
    const currentMovie = movies[safeIndex];

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "500px",
                overflow: "hidden",
                borderRadius: "16px", // BMS uses slightly less rounded corners on web often, but 16px is good
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                marginBottom: "40px",
                background: "#000",
            }}
        >
            {/* Background Image (Blurred/Darkened for BMS style effect if desired, but retaining the Netflix-ish large visual) */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${currentMovie.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                    transition: "background-image 0.5s ease-in-out", // Smooth background transition
                    filter: "blur(20px)", // Heavy blur to hide ratio issues and create atmospheric effect
                    transform: "scale(1.2)" // Scale up further to hide blur edges better
                }}
            >
                {/* Gradient Overlay - BMS style is often darker on the left/bottom */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "150px",
                        background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)"
                    }}
                />
            </div>

            {/* Content Overlay - BMS Style */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50px",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    maxWidth: "600px",
                    color: "white",
                }}
            >
                {/* Title */}
                <h1
                    style={{
                        fontSize: "3.5rem",
                        fontWeight: "800",
                        marginBottom: "15px",
                        lineHeight: "1.1",
                        textTransform: "uppercase", // BMS titles are often uppercase/bold
                        letterSpacing: "1px"
                    }}
                >
                    {currentMovie.title}
                </h1>

                {/* Rating & Votes */}
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "1.5rem", fontWeight: "bold" }}>
                        <span style={{ color: "#F53966" }}>🎫</span>
                        <span>{currentMovie.rating * 10}%</span>
                    </div>
                    <span style={{ fontSize: "1rem", opacity: 0.7 }}>{currentMovie.votes} Votes</span>
                </div>

                {/* Tags (Format, Language) */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "4px", fontSize: "0.9rem", fontWeight: "500" }}>2D</span>
                    <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "4px", fontSize: "0.9rem", fontWeight: "500" }}>{currentMovie.language}</span>
                </div>

                {/* Info Line */}
                <p style={{ fontSize: "1.1rem", marginBottom: "20px", color: "#eee", fontWeight: "500" }}>
                    {currentMovie.duration} • {currentMovie.genre} • UA
                </p>

                {/* Description */}
                <p style={{ fontSize: "1rem", marginBottom: "30px", color: "#ccc", lineHeight: "1.6", maxWidth: "500px" }}>
                    {currentMovie.desc || `${currentMovie.title} is an intense ${currentMovie.genre} movie that keeps you at the edge of your seat. Experience it now in theaters.`}
                </p>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "15px" }}>
                    <div
                        style={{
                            padding: "8px 24px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "white",
                            background: "#F53966",
                            borderRadius: "6px",
                            boxShadow: "0 4px 10px rgba(245, 57, 102, 0.3)",
                            display: "inline-block",
                            width: "fit-content"
                        }}
                    >
                        Booking Open
                    </div>
                </div>
            </div>

            {/* Poster Image on the Right */}
            <div style={{
                position: "absolute",
                top: "50%",
                right: "80px",
                transform: "translateY(-50%)",
                zIndex: 2,
                display: "block"
            }}>
                <img
                    src={currentMovie.img}
                    alt={currentMovie.title}
                    style={{
                        width: "280px",
                        height: "400px",
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: "12px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}
                />
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "100%",
                    width: "60px",
                    background: "linear-gradient(to right, rgba(0,0,0,0.5), transparent)",
                    border: "none",
                    color: "white",
                    fontSize: "3rem",
                    cursor: "pointer",
                    zIndex: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s"
                }}
                className="nav-arrow"
                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                onMouseOut={(e) => e.currentTarget.style.opacity = 0}
            >
                ‹
            </button>

            <button
                onClick={handleNext}
                style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    height: "100%",
                    width: "60px",
                    background: "linear-gradient(to left, rgba(0,0,0,0.5), transparent)",
                    border: "none",
                    color: "white",
                    fontSize: "3rem",
                    cursor: "pointer",
                    zIndex: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s"
                }}
                className="nav-arrow"
                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                onMouseOut={(e) => e.currentTarget.style.opacity = 0}
            >
                ›
            </button>

            {/* Indicators */}
            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "60px",
                    display: "flex",
                    gap: "8px",
                    zIndex: 3
                }}
            >
                {movies.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => handleDotClick(index)}
                        style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: index === currentIndex ? "white" : "rgba(255,255,255,0.5)",
                            cursor: "pointer",
                            transition: "background 0.3s"
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
