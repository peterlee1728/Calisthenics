import axios from "axios";
import { store } from "@/redux/store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = store.getState().token.authState.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getErrorMessage = (err, fallback) =>
  err?.response?.data?.error || err?.response?.data?.message || fallback;
