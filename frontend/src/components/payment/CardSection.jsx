import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CardSection(props) {
  const { amount } = props;
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const handleInputChange = (e) => {
    const { placeholder, value } = e.target;
    const key = placeholder === "Card Number" ? "number" :
      placeholder === "Card Holder Name" ? "name" :
        placeholder === "MM/YY" ? "expiry" : "cvv";
    setCardDetails(prev => ({ ...prev, [key]: value }));
  };

  const payNow = () => {
    if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
      alert("Please fill in all card details");
      return;
    }

    navigate("/confirm", {
      state: {
        movie: state.movie,
        theatre: state.theatre,
        time: state.time,
        seats: state.seats,
        paymentMode: "CARD",
        app: "Direct Card",
        amount: amount,
        isRedeemed: !!props.isRedeemed,
        pointsRedeemed: props.pointsRedeemed || 0
      }
    });
  };

  return (
    <>
      <h3>Pay by Debit / Credit Card</h3>

      <input placeholder="Card Number" style={input} onChange={handleInputChange} />
      <input placeholder="Card Holder Name" style={input} onChange={handleInputChange} />

      <div style={{ display: "flex", gap: 10 }}>
        <input placeholder="MM/YY" style={input} onChange={handleInputChange} />
        <input placeholder="CVV" style={input} onChange={handleInputChange} />
      </div>

      <button onClick={payNow} style={payBtn}>Pay Now</button>
    </>
  );
}

const input = {
  width: "100%",
  padding: 12,
  marginTop: 12,
  borderRadius: 8,
  border: "1px solid #444",
  background: "var(--bg-input)",
  color: "white",
  outline: "none"
};

const payBtn = {
  marginTop: 20,
  background: "var(--accent-primary)",
  padding: "12px 24px",
  borderRadius: 10,
  border: "none",
  fontWeight: "bold",
  color: "white",
  cursor: "pointer",
  boxShadow: "0 0 10px rgba(245, 57, 102, 0.4)"
};
