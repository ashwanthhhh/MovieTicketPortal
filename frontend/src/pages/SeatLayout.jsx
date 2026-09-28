import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BOOKING_URL } from "../api/config";

const SEAT_CONFIG = {
  ELITE: {
    price: 170,
    rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
    blocks: { left: 7, center: 12, right: 7 }
  },
  BUDGET: {
    price: 120,
    rows: ["P", "Q"],
    blocks: { left: 4, center: 8, right: 4 }
  }
};

function SeatLayout() {

  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);

  if (!state) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>No show selected</h2>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "12px 30px", background: "var(--accent-primary)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Go to Dashboard</button>
      </div>
    );
  }

  const { movie, theatre, time, location } = state;
  const [soldSeats, setSoldSeats] = useState([]);

  useEffect(() => {
    const fetchSoldSeats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !movie?._id) return;

        const response = await axios.get(`${BOOKING_URL}/movie/${movie._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (Array.isArray(response.data)) {
          setSoldSeats(response.data);
        }
      } catch (error) {
        console.error("Error fetching sold seats:", error);
      }
    };

    fetchSoldSeats();
  }, [movie?._id]);

  const toggleSeat = (seat) => {
    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const renderSeats = (row, count, start) =>
    [...Array(count)].map((_, i) => {
      const seatNo = start + i + 1;
      const seatId = `${row}${seatNo}`;
      const selected = selectedSeats.includes(seatId);
      const isSold = soldSeats.includes(seatId);

      return (
        <div
          key={seatId}
          onClick={() => !isSold && toggleSeat(seatId)}
          style={{
            width: 28,
            height: 30,
            borderRadius: "6px 6px 2px 2px",
            background: isSold ? "var(--accent-primary)" : (selected ? "var(--accent-secondary)" : "#FFFFFF"),
            opacity: isSold ? 1 : (selected ? 1 : 0.8),
            cursor: isSold ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "10px",
            color: selected || isSold ? "white" : "#000",
            fontWeight: "bold"
          }}
          onMouseOver={(e) => !isSold && !selected && (e.currentTarget.style.opacity = "1")}
          onMouseOut={(e) => !isSold && !selected && (e.currentTarget.style.opacity = "0.8")}
        >
          {seatNo}
        </div>
      );
    });

  const renderSection = (section) => (
    <div style={{ width: "100%", maxWidth: "900px" }}>
      <h3 style={{ textAlign: "left", margin: "40px 0 20px", color: "var(--text-muted)", fontSize: "0.9rem", letterSpacing: "2px", borderBottom: "1px solid var(--bg-input)", paddingBottom: "10px" }}>
        ₹{section.price} • {section === SEAT_CONFIG.ELITE ? "PREMIUM SEATS" : "ECONOMY SEATS"}
      </h3>

      {section.rows.map(row => (
        <div key={row} style={{ display: "flex", alignItems: "center", marginBottom: 10, justifyContent: "center" }}>
          <div style={{ width: 40, color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "bold" }}>{row}</div>

          <div style={{ display: "flex", gap: 8 }}>
            {renderSeats(row, section.blocks.left, 0)}
          </div>

          <div style={{ width: 50 }} />

          <div style={{ display: "flex", gap: 8 }}>
            {renderSeats(row, section.blocks.center, section.blocks.left)}
          </div>

          <div style={{ width: 50 }} />

          <div style={{ display: "flex", gap: 8 }}>
            {renderSeats(
              row,
              section.blocks.right,
              section.blocks.left + section.blocks.center
            )}
          </div>
        </div>
      ))}
    </div>
  );


  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId.charAt(0);
      const isElite = SEAT_CONFIG.ELITE.rows.includes(row);
      return total + (isElite ? SEAT_CONFIG.ELITE.price : SEAT_CONFIG.BUDGET.price);
    }, 0);
  };

  const totalPrice = calculateTotal();

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>

      {/* PREMIUM HERO HEADER */}
      <div style={{
        height: "220px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid var(--bg-input)"
      }}>
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${movie.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(40px) brightness(0.3)",
          transform: "scale(1.3)"
        }}></div>

        <button
          onClick={() => navigate(-1)}
          style={{ position: "absolute", top: "30px", left: "30px", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "30px", cursor: "pointer", backdropFilter: "blur(10px)", fontWeight: "bold", zIndex: 10 }}
        >
          ← Change Show
        </button>

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", display: "flex", gap: "30px", alignItems: "center", maxWidth: "1200px", width: "100%", padding: "0 40px" }}>
          <img src={movie.img} alt={movie.title} style={{ width: "100px", height: "140px", borderRadius: "10px", objectFit: "cover", objectPosition: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "5px" }}>{movie.title}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>{theatre} • {time}</p>
          </div>
        </div>
      </div>

      {/* SEATING AREA */}
      <div style={{ padding: "60px 20px 180px", maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>



        {renderSection(SEAT_CONFIG.ELITE)}
        {renderSection(SEAT_CONFIG.BUDGET)}

        {/* CURVED SCREEN INDICATOR AT BOTTOM */}
        <div style={{ width: "100%", maxWidth: "600px", marginTop: "80px", marginBottom: "40px", position: "relative" }}>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "15px", letterSpacing: "8px", textTransform: "uppercase" }}>Screen</p>
          <div style={{
            height: "4px",
            background: "var(--accent-primary)",
            boxShadow: "0 0 20px var(--accent-primary)",
            borderRadius: "50% / 0 0 100% 100%",
            transform: "scale(1.1)",
            opacity: 0.8
          }} />
        </div>

        {/* LEGEND */}
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "40px" }}>
          <Legend color="#FFFFFF" text="Available" />
          <Legend color="var(--accent-primary)" text="Reserved" />
          <Legend color="var(--accent-secondary)" text="Selected" />
        </div>
      </div>

      {/* SLEEK FOOTER SUMMARY */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(10, 10, 10, 0.95)",
        backdropFilter: "blur(20px)",
        padding: "20px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        zIndex: 1000
      }}>
        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0, textTransform: "uppercase" }}>Date & Time</p>
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold" }}>{time}</p>
          </div>
          <div style={{ borderLeft: "1px solid #333", paddingLeft: "40px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0, textTransform: "uppercase" }}>Theatre & Section</p>
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold" }}>{theatre} • Premium</p>
          </div>
          <div style={{ borderLeft: "1px solid #333", paddingLeft: "40px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0, textTransform: "uppercase" }}>Selected Seats</p>
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold", color: "var(--accent-secondary)" }}>
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0, textTransform: "uppercase" }}>Total Price</p>
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>₹{totalPrice}</p>
          </div>
          <button
            disabled={!selectedSeats.length}
            onClick={() => navigate("/payment", { state: { movie, theatre, location, time, seats: selectedSeats, total: totalPrice } })}
            style={{
              background: "var(--accent-primary)",
              color: "white",
              padding: "15px 50px",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.1rem",
              transition: "all 0.3s",
              opacity: selectedSeats.length ? 1 : 0.4,
              boxShadow: selectedSeats.length ? "0 10px 30px rgba(229, 9, 20, 0.4)" : "none"
            }}
          >
            Buy Tickets
          </button>
        </div>
      </div>

    </div>
  );
}

const Legend = ({ color, border, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{
      width: 18,
      height: 18,
      background: color,
      border: border ? `1px solid ${border}` : "none"
    }} />
    <span>{text}</span>
  </div>
);

export default SeatLayout;
