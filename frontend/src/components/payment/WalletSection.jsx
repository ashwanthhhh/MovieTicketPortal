import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function WalletSection(props) {
  const { amount } = props;
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedWallet, setSelectedWallet] = useState("");

  const wallets = ["Amazon Pay", "Mobikwik", "Freecharge"];

  const payNow = () => {
    if (!selectedWallet) {
      alert("Please select a wallet");
      return;
    }

    navigate("/confirm", {
      state: {
        movie: state.movie,
        theatre: state.theatre,
        time: state.time,
        seats: state.seats,
        paymentMode: "WALLET",
        app: selectedWallet,
        amount: amount,
        isRedeemed: !!props.isRedeemed,
        pointsRedeemed: props.pointsRedeemed || 0
      }
    });
  };

  return (
    <>
      <h3>Pay by Wallets</h3>
      {wallets.map(wallet => (
        <div
          key={wallet}
          onClick={() => setSelectedWallet(wallet)}
          style={{
            padding: 15,
            marginTop: 12,
            background: "var(--bg-input)",
            borderRadius: 10,
            border: selectedWallet === wallet ? "1px solid var(--status-success)" : "none",
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer"
          }}
        >
          {wallet}
          {selectedWallet === wallet && "✔"}
        </div>
      ))}
      <button onClick={payNow} style={payBtn}>Pay Now</button>
    </>
  );
}

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
