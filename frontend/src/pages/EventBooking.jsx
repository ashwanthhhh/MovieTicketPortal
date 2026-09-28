import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EventBooking = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    if (!state?.event) {
        return (
            <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <h2 style={{ marginBottom: "20px" }}>❌ No event selected</h2>
                <button onClick={() => navigate("/events")} style={{ padding: "12px 30px", background: "var(--accent-primary)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" }}>Back to Events</button>
            </div>
        );
    }

    const event = state.event;
    const [selectedDate, setSelectedDate] = useState("Fri 20 Mar");
    const [selectedTime, setSelectedTime] = useState("");

    const dates = ["Fri 20 Mar", "Sat 21 Mar", "Sun 22 Mar", "Wed 25 Mar", "Thu 26 Mar", "Fri 27 Mar", "Sat 28 Mar"];
    const times = ["02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"];

    const handleProceed = () => {
        if (!selectedTime) {
            alert("Please select a time slot");
            return;
        }
        navigate("/payment", {
            state: {
                movie: { title: event.title, img: event.img },
                theatre: event.location,
                time: `${selectedDate}, ${selectedTime}`,
                seats: ["Event Ticket"],
                total: event.price || 999
            }
        });
    };

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>

            {/* PREMIUM HERO HEADER */}
            <div style={{
                height: "400px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url(${event.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    filter: "blur(40px) brightness(0.4)",
                    transform: "scale(1.2)"
                }}></div>

                <button
                    onClick={() => navigate(-1)}
                    style={{ position: "absolute", top: "30px", left: "30px", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "12px 25px", borderRadius: "30px", cursor: "pointer", backdropFilter: "blur(10px)", fontWeight: "bold", zIndex: 10 }}
                >
                    ← Back
                </button>

                <div style={{ position: "relative", zIndex: 2, textAlign: "center", display: "flex", gap: "40px", alignItems: "center", maxWidth: "1200px", width: "100%", padding: "0 40px" }}>
                    <img src={event.img} alt={event.title} style={{ width: "220px", height: "300px", borderRadius: "16px", objectFit: "cover", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <div style={{ textAlign: "left" }}>
                        <span style={{ padding: "6px 15px", background: "var(--accent-secondary)", color: "black", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>EVENT BOOKING</span>
                        <h1 style={{ fontSize: "3.5rem", margin: "15px 0", textShadow: "0 5px 15px rgba(0,0,0,0.5)" }}>{event.title}</h1>
                        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>📍 {event.location}</p>
                    </div>
                </div>
            </div>

            {/* MAIN SELECTION Area */}
            <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%", padding: "60px 20px" }}>

                <div style={{
                    background: "var(--bg-secondary)",
                    borderRadius: "30px",
                    padding: "50px",
                    border: "1px solid var(--bg-input)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.4)"
                }}>
                    <div style={{ marginBottom: "50px" }}>
                        <h3 style={{ fontSize: "1.3rem", marginBottom: "25px", fontWeight: "bold", color: "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>1. Select Date</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                            {dates.map((date, i) => (
                                <div key={i} onClick={() => setSelectedDate(date)} style={{
                                    padding: "15px 25px",
                                    borderRadius: "15px",
                                    border: `1px solid ${selectedDate === date ? "var(--accent-secondary)" : "var(--bg-input)"}`,
                                    background: selectedDate === date ? "var(--accent-secondary)" : "rgba(255,255,255,0.03)",
                                    color: selectedDate === date ? "black" : "white",
                                    cursor: "pointer",
                                    fontWeight: selectedDate === date ? "bold" : "normal",
                                    transition: "all 0.2s",
                                    textAlign: "center",
                                    minWidth: "120px"
                                }}>
                                    {date}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "1.3rem", marginBottom: "25px", fontWeight: "bold", color: "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>2. Select Time Slot</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                            {times.map((time, i) => (
                                <div key={i} onClick={() => setSelectedTime(time)} style={{
                                    padding: "18px",
                                    borderRadius: "15px",
                                    border: `1px solid ${selectedTime === time ? "var(--status-success)" : "var(--bg-input)"}`,
                                    background: selectedTime === time ? "var(--status-success)" : "transparent",
                                    color: selectedTime === time ? "black" : "white",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    fontWeight: selectedTime === time ? "bold" : "normal",
                                    transition: "all 0.2s"
                                }}>
                                    {time}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: "40px", textAlign: "center" }}>
                    <button
                        onClick={handleProceed}
                        style={{
                            width: "100%",
                            maxWidth: "500px",
                            padding: "20px",
                            background: selectedTime ? "var(--accent-primary)" : "var(--bg-input)",
                            color: "white",
                            border: "none",
                            borderRadius: "15px",
                            fontWeight: "bold",
                            cursor: selectedTime ? "pointer" : "not-allowed",
                            fontSize: "1.2rem",
                            boxShadow: selectedTime ? "0 10px 30px rgba(245, 57, 102, 0.4)" : "none",
                            transition: "all 0.3s",
                            opacity: selectedTime ? 1 : 0.5
                        }}
                    >
                        {selectedTime ? `Proceed to Pay ₹${event.price || 999}` : "Select a Time Slot"}
                    </button>
                    <p style={{ marginTop: "20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>By clicking proceed, you agree to the CineVerse Terms & Conditions.</p>
                </div>
            </div>
        </div>
    );
};

export default EventBooking;
