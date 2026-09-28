const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const API_BASE_URL = `${BASE_URL}/api`;

export const AUTH_URL = `${API_BASE_URL}/auth`;
export const USERS_URL = `${API_BASE_URL}/users`;
export const MOVIES_URL = `${API_BASE_URL}/movies`;
export const BOOKING_URL = `${API_BASE_URL}/bookings`;
export const VOTE_URL = `${API_BASE_URL}/votes`;
export const TRANSFER_URL = `${API_BASE_URL}/transfers`;
