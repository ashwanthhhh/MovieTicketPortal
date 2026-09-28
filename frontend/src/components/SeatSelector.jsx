import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SeatSelector from "./SeatSelector";

export default function SeatLayout() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // SAFETY CHECK
  if (!state) return <h2>No show selected</h2>;

  const { movie, theatre, time, seatPrice } = state;

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleProceed = () => {
    navigate("/payment", {
      state: {
        movie,
        theatre,
        time,
        seats: selectedSeats,
        seatPrice
      }
    });
  };

  return (
    <div style={page}>
      <h2>{movie.title} ({movie.language})</h2>
      <p>{theatre} | {time}</p>

      <SeatSelector
        totalSeats={40}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
      />

      <div style={footer}>
        <span>{selectedSeats.length} Seats Selected</span>

        <button
          disabled={!selectedSeats.length}
          onClick={handleProceed}
          style={{
            ...payBtn,
            opacity: selectedSeats.length ? 1 : 0.5
          }}
        >
          Proceed ₹{selectedSeats.length * seatPrice}
        </button>
      </div>
    </div>
  );
}
