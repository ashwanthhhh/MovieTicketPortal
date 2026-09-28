export default function OrderSummary({
  movie,
  theatre,
  time,
  seats,
  ticketAmount,
  convenienceFee,
  discount = 0,
  total
}) {
  return (
    <div style={box}>
      <h3 style={{ color: "var(--accent-primary)", marginBottom: "15px" }}>{movie.title}</h3>

      {theatre && <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>📍 {theatre}</p>}
      {time && <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>🕒 {time}</p>}
      {!theatre && !time && <p style={{ color: "var(--accent-secondary)" }}>📺 Online Streaming</p>}

      <hr style={{ margin: "20px 0", opacity: 0.1 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {seats && seats.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Seats:</span>
            <span>{seats.join(", ")}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-muted)" }}>{seats && seats.length > 0 ? "Tickets" : "Rent Price"}:</span>
          <span>₹{ticketAmount}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-muted)" }}>Convenience Fee:</span>
          <span>₹{convenienceFee}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--status-success)", fontWeight: "bold" }}>
            <span>Gamification Discount:</span>
            <span>-₹{discount}</span>
          </div>
        )}
      </div>

      <hr style={{ margin: "20px 0", opacity: 0.1 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: "bold" }}>Total Amount</span>
        <h2 style={{ color: "var(--status-success)", margin: 0 }}>₹{total}</h2>
      </div>
    </div>
  );
}

const box = {
  background: "var(--bg-secondary)",
  padding: 20,
  borderRadius: 14,
  color: "var(--text-primary)"
};
