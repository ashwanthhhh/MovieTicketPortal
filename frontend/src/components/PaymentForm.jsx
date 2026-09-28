import React, { useState } from "react";

const PaymentForm = ({ onPay }) => {
  const [card, setCard] = useState("");
  const handlePay = (e) => {
    e.preventDefault();
    alert("Payment Successful! ✅"); // Mock payment
    onPay();
  };

  return (
    <form onSubmit={handlePay} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        type="text"
        placeholder="Card Number"
        value={card}
        onChange={(e) => setCard(e.target.value)}
        required
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #444",
          background: "var(--bg-input)",
          color: "white",
          outline: "none"
        }}
      />
      <button type="submit" style={{
        padding: "10px",
        background: "var(--accent-primary)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 0 10px rgba(245, 57, 102, 0.4)"
      }}>Pay Now</button>
    </form>
  );
};

export default PaymentForm;
