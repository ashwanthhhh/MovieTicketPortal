import React from "react";

function MovieInfoCard({ movie }) {
  if (!movie) return null;

  return (
    <div style={{
      background: "var(--bg-secondary)",
      borderRadius: "20px",
      padding: "20px",
      color: "var(--text-primary)"
    }}>

      {/* MOVIE IMAGE */}
      <img
        src={movie.img}
        alt={movie.title}
        style={{
          width: "100%",
          borderRadius: "15px",
          objectFit: "cover"
        }}
      />

      {/* RATING BOX */}
      <div style={{
        marginTop: "15px",
        background: "var(--bg-input)",
        padding: "15px",
        borderRadius: "12px"
      }}>
        <h3>⭐ {movie.rating} / 10</h3>
        <p style={{ opacity: 0.8 }}>{movie.votes} Votes</p>
      </div>

      {/* MOVIE DETAILS */}
      <p style={{ marginTop: "15px" }}>⏱ {movie.duration}</p>
      <p>🎭 {movie.genre}</p>
      <p>🌐 {movie.language}</p>
    </div>
  );
}

export default MovieInfoCard;
