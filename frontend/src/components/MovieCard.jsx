import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "10px",
        padding: "15px",
        margin: "15px",
        width: "250px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.5)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)"
      }}
    >
      <h3>{movie.title || "Untitled Movie"}</h3>

      <p><b>Genre:</b> {movie.genre || "N/A"}</p>
      <p><b>Date:</b> {movie.date || "N/A"}</p>
      <p><b>Time:</b> {movie.time || "N/A"}</p>
      <p><b>Seats:</b> {movie.availableSeats ?? 0}</p>

      <button
        style={{
          marginTop: "10px",
          padding: "8px",
          width: "100%",
          backgroundColor: "var(--accent-primary)",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 0 10px rgba(245, 57, 102, 0.4)"
        }}
        onClick={() => navigate(`/booking/${movie._id}`)}
      >
        Book Now
      </button>
    </div>
  );
};

export default MovieCard;
