import axios from "axios";
import { BOOKING_URL } from "../api/config";

const API_URL = BOOKING_URL;

// Token header helper
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// 🎟️ Create booking (after mock payment)
export const createBooking = async (bookingData) => {
  const response = await axios.post(
    `${API_URL}/create`,
    bookingData,
    authHeader()
  );
  return response.data;
};

// 📄 Get bookings of logged-in user
export const getMyBookings = async () => {
  const response = await axios.get(
    `${API_URL}/my-bookings`,
    authHeader()
  );
  return response.data;
};

// 🔁 Transfer ticket to another user
export const transferTicket = async (transferData) => {
  const response = await axios.post(
    `${API_URL}/transfer`,
    transferData,
    authHeader()
  );
  return response.data;
};
