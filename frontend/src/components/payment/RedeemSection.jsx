export default function RedeemSection({ points, onRedeem, isRedeemed }) {
  const required = 100;
  // Calculate discount based on total points available (e.g., 100 pts = ₹10, 120 pts = ₹12)
  const discountAmount = points >= required ? Math.floor(points / 10) : 0;
  const pointsToRedeem = discountAmount * 10;

  return (
    <div style={{ padding: "10px" }}>
      <h3 style={{ marginBottom: "15px", color: "var(--accent-secondary)" }}>Redeem Points</h3>

      <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "15px", border: "1px solid var(--bg-input)" }}>
        <p style={{ fontSize: "1.1rem", marginBottom: "10px" }}>Your Points: <span style={{ color: "var(--accent-secondary)", fontWeight: "bold" }}>{points}</span></p>

        {isRedeemed ? (
          <div style={{ color: "var(--status-success)", fontWeight: "bold", marginTop: "10px", padding: "10px", background: "rgba(0, 255, 234, 0.1)", borderRadius: "8px" }}>
            ✨ ₹{discountAmount} Discount Applied! ({pointsToRedeem} points used)
          </div>
        ) : points >= required ? (
          <>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>You are eligible to redeem {pointsToRedeem} points for a ₹{discountAmount} discount.</p>
            <button
              onClick={() => onRedeem(discountAmount, pointsToRedeem)}
              style={{ ...payBtn, background: "var(--accent-secondary)", color: "black", cursor: "pointer" }}
            >
              Redeem {pointsToRedeem} Points
            </button>
          </>
        ) : (
          <p style={{ color: "var(--status-error)", fontSize: "0.9rem" }}>
            Need {required - points} more points to unlock discount.
          </p>
        )}
      </div>
    </div>
  );
}

const payBtn = {
  marginTop: 20,
  background: "var(--bg-input)", // Disabled state
  padding: "12px 24px",
  borderRadius: 10,
  border: "none",
  color: "var(--text-muted)",
  cursor: "not-allowed"
};
