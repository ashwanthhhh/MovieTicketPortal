import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BOOKING_URL } from "../api/config";

export default function TicketConfirm() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [bookingId, setBookingId] = useState(() => {
    return state?.bookingId || `BK-${Math.floor(1000 + Math.random() * 9000)}`;
  });
  const ticketRef = useRef(null);
  const [showReward, setShowReward] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const handleDownloadPDF = async () => {
    const element = ticketRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Center the image if it's smaller than the page, or just place it at top
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Ticket_${bookingId}.pdf`);
    } catch (error) {
      console.error("Could not generate PDF", error);
    }
  };

  useEffect(() => {
    if (state) {
      const handleBackendIntegrations = async () => {
        try {
          const token = localStorage.getItem("token");
          let finalBookingId = bookingId;

          // 0. Persist real booking to Database if newly bought
          if (token && state.movie?._id && !state.isViewOnly) {
            const bookingRes = await axios.post(
              BOOKING_URL,
              { movieId: state.movie._id, seats: state.seats || ["A1"] },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (bookingRes.data && bookingRes.data.booking) {
              finalBookingId = bookingRes.data.booking._id;
              setBookingId(finalBookingId); // Update UI to show the real MongoDB ticket ID

              // Notify user of gamification points
              if (bookingRes.data.points !== undefined) {
                const points = (state.seats?.length || 1) * 10;
                setEarnedPoints(points);
                setShowReward(true);
                setTimeout(() => setShowReward(false), 5000);
                console.log(`Gamification: +${points} points earned for booking! Total Points: ${bookingRes.data.points}`);
              }
            }
          }

          // Update local storage with real mapping (for transfers, etc)
          const bookingWithId = { ...state, bookingId: finalBookingId };
          localStorage.setItem("cineLastBooking", JSON.stringify(bookingWithId));

          if (!token || state.isViewOnly) return;

          // 1. Redeem points if discount was applied
          if (state.isRedeemed) {
            await fetch("http://localhost:5000/api/gamification/redeem", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ pointsToRedeem: state.pointsRedeemed || 0 })
            });
          }
        } catch (err) {
          console.error("Error in booking/gamification flow:", err.response?.data?.message || err.message);
        }
      };

      handleBackendIntegrations();
    }
  }, [state]);

  if (!state) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>No Booking Found</h2>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "12px 30px", background: "var(--accent-primary)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={box}>
      <style>{`
        @keyframes slideDownReward {
          0% { transform: translate(-50%, -100px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
      
      {showReward && (
        <div style={rewardToast}>
          <span style={{ fontSize: "1.2rem" }}></span>
          <span>You earned <b style={{ fontSize: "1.1rem" }}>{earnedPoints} Cinecoins!</b></span>
          <span style={{ fontSize: "1.2rem" }}></span>
        </div>
      )}

      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: (state.movie?.image || state.movie?.img) ? `url(${state.movie.image || state.movie.img})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "blur(60px) brightness(0.2)",
        transform: "scale(1.3)"
      }}></div>

      <div style={card} ref={ticketRef}>
        <h2 style={{ color: "var(--accent-primary)", marginTop: "25px", fontSize: "2.2rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "bold" }}>Booking Confirmed</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "35px", fontSize: "1.1rem" }}>Your cinematic journey starts here.</p>

        <div style={ticketBody}>
          <div style={{
            height: "160px",
            backgroundImage: (state.movie?.image || state.movie?.img) ? `url(${state.movie.image || state.movie.img})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            position: "relative"
          }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(transparent, var(--bg-secondary))" }}></div>
          </div>

          <div style={{ padding: "20px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>MOVIE</span>
                <span style={{ fontSize: "1.4rem", fontWeight: "bold", display: "block" }}>{state.movie?.title}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={labelStyle}>BOOKING ID</span>
                <span style={{ fontSize: "0.9rem", fontWeight: "bold", display: "block", color: "var(--accent-primary)" }}>{bookingId.substring(0, 8)}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <span style={labelStyle}>DATE & TIME</span>
                <span style={valueStyle}>{state.time}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={labelStyle}>THEATRE</span>
                <span style={valueStyle}>{state.theatre}</span>
              </div>
              <div>
                <span style={labelStyle}>CONFIRMED SEATS</span>
                <span style={{ ...valueStyle, color: "var(--accent-secondary)" }}>
                  {Array.isArray(state.seats) ? state.seats.join(", ") : state.seats || "A1"}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={labelStyle}>AMOUNT PAID</span>
                <span style={{ ...valueStyle, color: "var(--status-success)" }}>₹{state.amount}</span>
              </div>
            </div>
          </div>

          <div style={dashedLine}>
             <div style={{ position: "absolute", left: -10, top: -10, width: 20, height: 20, background: "var(--bg-primary)", borderRadius: "50%" }}></div>
             <div style={{ position: "absolute", right: -10, top: -10, width: 20, height: 20, background: "var(--bg-primary)", borderRadius: "50%" }}></div>
          </div>

          <div style={{ padding: "30px", background: "rgba(255,255,255,0.03)", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CINEVERSE-${bookingId}`} alt="QR" style={{ width: "100px", height: "100px", border: "5px solid white", borderRadius: "8px" }} />
            </div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", letterSpacing: "2px" }}>SCAN AT ENTRY</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "40px" }} data-html2canvas-ignore>
          <button style={download} onClick={handleDownloadPDF}>Download PDF</button>
          <button style={home} onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

const dashedLine = {
  borderTop: "2px dashed var(--bg-input)",
  height: "2px",
  width: "100%",
  position: "relative"
};

const ticketBody = {
  background: "var(--bg-secondary)",
  borderRadius: "24px",
  overflow: "hidden",
  border: "1px solid var(--bg-input)",
  textAlign: "left",
  boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)"
};

const itemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  padding: "15px 0",
  borderBottom: "1px solid rgba(255,255,255,0.05)"
};

const labelStyle = {
  color: "var(--text-muted)",
  fontSize: "0.75rem",
  letterSpacing: "1px",
  fontWeight: "bold"
};

const valueStyle = {
  color: "var(--text-primary)",
  fontSize: "1.1rem",
  fontWeight: "600"
};

const box = {
  minHeight: "100vh",
  background: "var(--bg-primary)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "var(--text-primary)",
  position: "relative",
  overflow: "hidden"
};

const card = {
  background: "rgba(20, 20, 30, 0.7)",
  backdropFilter: "blur(20px)",
  padding: 50,
  borderRadius: 40,
  width: "100%",
  maxWidth: "500px",
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
  position: "relative",
  zIndex: 10
};

const check = {
  background: "var(--status-success)",
  width: 70,
  height: 70,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 40,
  margin: "-85px auto 20px",
  color: "#000",
  boxShadow: "0 0 30px rgba(0, 255, 234, 0.4)",
  border: "5px solid var(--bg-primary)"
};

const download = {
  flex: 1,
  padding: "16px",
  background: "var(--accent-primary)",
  border: "none",
  borderRadius: "15px",
  fontWeight: "bold",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  boxShadow: "0 10px 20px rgba(245, 57, 102, 0.3)",
  transition: "all 0.2s"
};

const home = {
  flex: 1,
  padding: "16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid var(--bg-input)",
  color: "white",
  borderRadius: "15px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "all 0.2s"
};

const rewardToast = {
  position: "fixed",
  top: "40px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(10, 20, 30, 0.8)",
  backdropFilter: "blur(20px)",
  border: "1.5px solid var(--accent-secondary)",
  padding: "18px 45px",
  borderRadius: "100px",
  color: "var(--accent-secondary)",
  fontWeight: "bold",
  zIndex: 5000,
  display: "flex",
  alignItems: "center",
  gap: "15px",
  boxShadow: "0 20px 50px rgba(0, 255, 234, 0.3), inset 0 0 20px rgba(0, 255, 234, 0.1)",
  animation: "slideDownReward 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
  whiteSpace: "nowrap"
};
