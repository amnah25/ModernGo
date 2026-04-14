import axios from "axios";

const healthApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// ========== HEALTH CHECKS ==========
export const checkApiRoot = () => healthApi.get("/");

export const checkHealth = () => healthApi.get("/health");
