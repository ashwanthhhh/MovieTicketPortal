import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UPISection(props) {
  const { amount } = props;
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  // const seatCount = state?.seats?.length || 0;
  // const totalAmount = seatCount * state?.pricePerSeat; // 🔴 Removed to avoid NaN


  const payNow = () => {
    if (!selected) {
      alert("Select a UPI app");
      return;
    }

    navigate("/confirm", {
      state: {
        movie: state.movie,
        theatre: state.theatre,
        time: state.time,
        seats: state.seats,
        paymentMode: "UPI",
        app: selected,
        amount: amount,
        isRedeemed: !!props.isRedeemed, // Pass redemption status
        pointsRedeemed: props.pointsRedeemed || 0
      }
    });
  };

  return (
    <>
      <h3>Pay by UPI</h3>

      {["Google Pay", "PhonePe", "Paytm"].map(app => (
        <div
          key={app}
          onClick={() => setSelected(app)}
          style={{
            padding: 15,
            marginTop: 12,
            background: "var(--bg-input)",
            borderRadius: 10,
            border: selected === app ? "1px solid var(--status-success)" : "none",
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer"
          }}
        >
          {app}
          {selected === app && "✔"}
        </div>
      ))}

      <button onClick={payNow} style={payBtn}>
        Pay Now
      </button>
    </>
  );
}

const payBtn = {
  marginTop: 20,
  background: "var(--accent-primary)",
  padding: "12px 24px",
  border: "none",
  borderRadius: 10,
  fontWeight: "bold",
  cursor: "pointer",
  color: "white",
  boxShadow: "0 0 10px rgba(245, 57, 102, 0.4)"
};
