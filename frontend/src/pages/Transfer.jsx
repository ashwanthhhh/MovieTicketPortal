import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TRANSFER_URL } from "../api/config";
import { AuthContext } from "../context/AuthContext";

const Transfer = () => {
  const { user } = useContext(AuthContext);
  const [bookingId, setBookingId] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toMobile, setToMobile] = useState("");
  const [lastBooking, setLastBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cineLastBooking");
    if (saved) {
      const parsed = JSON.parse(saved);
      setLastBooking(parsed);
      // Auto-fill booking ID if available
      if (parsed.bookingId) {
        setBookingId(parsed.bookingId);
      }
    }
  }, []);

  const handleTransfer = async () => {
    if (!user) {
      alert("Please login to transfer tickets");
      return;
    }
    if (!bookingId || !toEmail || !toMobile) {
      alert("Please fill all fields (Booking ID, Gmail, and Mobile Number)");
      return;
    }

    try {
      await axios.post(`${TRANSFER_URL}/request`, {
        bookingId,
        fromUserId: user._id,
        toUserEmail: toEmail,
        toUserMobile: toMobile
      });
      alert("Transfer Requested ✅");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      alert(`Transfer failed: ${errorMsg}`);
    }
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>

      {/* CINEMATIC HEADER */}
      <div style={{
        height: "300px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/transfer-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", backdropFilter: "blur(5px)" }}
        >
          ← Dashboard
        </button>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem", color: "var(--accent-primary)", textShadow: "0 0 20px rgba(245, 57, 102, 0.6)", marginBottom: "10px" }}>Ticket Transfer</h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", letterSpacing: "1px" }}>Send the Magic to a Friend</p>
        </div>
      </div>

      <div style={{ padding: "60px 50px", display: "flex", justifyContent: "center", gap: "50px", flexWrap: "wrap" }}>
        <div style={{
          background: "var(--bg-secondary)",
          padding: "50px",
          borderRadius: "30px",
          flex: "1",
          maxWidth: "550px",
          minWidth: "350px",
          border: "1px solid var(--bg-input)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)"
        }}>
          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "0.95rem", color: "var(--accent-secondary)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Booking Identification</label>
            <input
              placeholder="Enter Booking ID (e.g., BK-7788)"
              value={bookingId}
              onChange={e => setBookingId(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "0.95rem", color: "var(--accent-secondary)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Recipient Gmail</label>
            <input
              placeholder="Enter recipient's gmail address"
              value={toEmail}
              onChange={e => setToEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "40px" }}>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "0.95rem", color: "var(--accent-secondary)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Recipient Mobile Number</label>
            <input
              placeholder="Enter recipient's mobile number"
              value={toMobile}
              onChange={e => setToMobile(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button onClick={handleTransfer} style={btnStyle}>
            Authorize Transfer
          </button>

          <div style={{ marginTop: "40px", padding: "20px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "15px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, lineHeight: "1.6" }}>
              💡 <strong>Secure Transfer:</strong> Once requested, the recipient will receive a notification to accept. This action cannot be undone once accepted.
            </p>
          </div>
        </div>

        {/* RIGHT SIDEBAR - LATEST TICKET */}
        {lastBooking && (
          <div style={{
            width: "350px",
            display: "flex",
            flexDirection: "column",
            gap: "25px"
          }}>
            <h3 style={{ color: "var(--accent-secondary)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Your Last Booking
            </h3>

            <div style={{
              background: "var(--bg-secondary)",
              borderRadius: "20px",
              padding: "30px",
              border: "1px solid var(--accent-primary)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
              position: "relative"
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "var(--accent-primary)", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}></div>

              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Booking ID</span>
                <p style={{ color: "var(--accent-primary)", fontWeight: "bold", fontSize: "1.1rem", margin: "5px 0" }}>{lastBooking.bookingId || "BK-FIXED-77"}</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Movie / Event</span>
                <p style={{ color: "white", fontWeight: "600", fontSize: "1rem", margin: "3px 0" }}>{lastBooking.movie?.title}</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Venue / Time</span>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "3px 0" }}>📍 {lastBooking.theatre}</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "3px 0" }}>🗓️ {lastBooking.time}</p>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px dashed rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Seats</span>
                  <p style={{ color: "var(--accent-secondary)", fontWeight: "bold", fontSize: "0.95rem", margin: "3px 0" }}>{lastBooking.seats?.join(", ")}</p>
                </div>
                <div style={{ background: "white", padding: "4px", borderRadius: "8px" }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CINEVERSE-${lastBooking.bookingId || "BK-FIXED-77"}`} alt="QR" style={{ width: "50px", height: "50px" }} />
                </div>
              </div>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", fontStyle: "italic" }}>
              * You can use the Booking ID above to request a transfer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid var(--bg-input)",
  background: "rgba(0,0,0,0.2)",
  color: "white",
  outline: "none",
  fontSize: "1rem",
  transition: "all 0.3s",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
};

const btnStyle = {
  width: "100%",
  padding: "18px",
  background: "var(--accent-primary)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1.1rem",
  boxShadow: "0 10px 20px rgba(245, 57, 102, 0.3)",
  transition: "all 0.3s"
};

export default Transfer;
