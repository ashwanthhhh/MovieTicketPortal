import axios from "axios";
import { AUTH_URL } from "../api/config";

const API_URL = `${AUTH_URL}/`;

export const login = async (email, password) => {
  const res = await axios.post(API_URL + "login", { email, password });
  return res.data;
};

export const register = async (name, email, password) => {
  const res = await axios.post(API_URL + "register", { name, email, password });
  return res.data;
};
