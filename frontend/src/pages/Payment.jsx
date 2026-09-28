import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added useLocation
import Sidebar from "../components/payment/Sidebar";
import UPISection from "../components/payment/UPISection";
import CardSection from "../components/payment/CardSection";
import WalletSection from "../components/payment/WalletSection";
import RedeemSection from "../components/payment/RedeemSection";
import OrderSummary from "../components/payment/OrderSummary";

export default function Payment() {
  const { state } = useLocation();
  const [method, setMethod] = useState("UPI");

  if (!state) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>❌ Session Expired</h2>
        <button onClick={() => window.location.href = "/dashboard"} style={{ padding: "12px 30px", background: "var(--accent-primary)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Go to Dashboard</button>
      </div>
    );
  }

  const { movie, theatre = "", time = "", seats = [], total = 0 } = state;
  const [userPoints, setUserPoints] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isRedeemed, setIsRedeemed] = useState(false);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/gamification/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setUserPoints(data.points || 0);
      } catch (err) {
        console.error("Error fetching points:", err);
      }
    };
    fetchPoints();
  }, []);

  const [pointsRedeemed, setPointsRedeemed] = useState(0);

  const handleRedeem = (appliedDiscount, usedPoints) => {
    setDiscount(appliedDiscount);
    setPointsRedeemed(usedPoints);
    setIsRedeemed(true);
  };

  const convenienceFee = 60;
  const finalTotal = total + convenienceFee - discount;

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <header style={{ marginBottom: "40px", borderBottom: "1px solid var(--bg-input)", paddingBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", color: "var(--accent-primary)", textShadow: "0 0 20px rgba(245, 57, 102, 0.4)", margin: 0 }}>Secure Checkout</h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "5px" }}>Choose your preferred payment method</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>TIMER</span>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--status-success)" }}>09:59</div>
          </div>
        </header>

        <div style={styles.layout}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Sidebar active={method} setActive={setMethod} />
          </div>

          <div style={styles.center}>
            <div style={{ padding: "30px" }}>
              {method === "UPI" && <UPISection amount={finalTotal} isRedeemed={isRedeemed} pointsRedeemed={pointsRedeemed} />}
              {method === "CARD" && <CardSection amount={finalTotal} isRedeemed={isRedeemed} pointsRedeemed={pointsRedeemed} />}
              {method === "WALLET" && <WalletSection amount={finalTotal} isRedeemed={isRedeemed} pointsRedeemed={pointsRedeemed} />}
              {method === "REDEEM" && (
                <RedeemSection
                  amount={finalTotal}
                  points={userPoints}
                  onRedeem={handleRedeem}
                  isRedeemed={isRedeemed}
                />
              )}
            </div>
          </div>

          <OrderSummary
            movie={movie}
            theatre={theatre}
            time={time}
            seats={seats}
            ticketAmount={total}
            convenienceFee={convenienceFee}
            discount={discount}
            total={finalTotal}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
    padding: "60px 20px",
    color: "var(--text-primary)"
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "280px 1fr 350px",
    gap: "30px"
  },
  center: {
    background: "var(--bg-secondary)",
    borderRadius: "24px",
    border: "1px solid var(--bg-input)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
    minHeight: "500px"
  }
};
