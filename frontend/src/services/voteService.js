import axios from "axios";
import { VOTE_URL } from "../api/config";

const API_URL = VOTE_URL;

// Token header helper
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// 🗳️ Vote for a movie
export const voteMovie = async (voteData) => {
  const response = await axios.post(
    `${API_URL}/vote`,
    voteData,
    authHeader()
  );
  return response.data;
};

// 📊 Get voting results
export const getVoteResults = async () => {
  const response = await axios.get(
    `${API_URL}/results`,
    authHeader()
  );
  return response.data;
};
