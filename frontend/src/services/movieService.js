import axios from "axios";
import { MOVIES_URL } from "../api/config";

const API_URL = MOVIES_URL;

// Token header helper
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// 🎬 Get all movies
export const getAllMovies = async () => {
  const response = await axios.get(API_URL, authHeader());
  return response.data;
};

// ➕ Admin: Add movie
export const addMovie = async (movieData) => {
  const response = await axios.post(
    `${API_URL}/add`,
    movieData,
    authHeader()
  );
  return response.data;
};

// ❌ Admin: Delete movie
export const deleteMovie = async (movieId) => {
  const response = await axios.delete(
    `${API_URL}/${movieId}`,
    authHeader()
  );
  return response.data;
};
