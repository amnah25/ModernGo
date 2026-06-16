import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("storeToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  console.log(`📡 REQUEST: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, {
    data: config.data,
    headers: config.headers,
  });
  
  return config;
});

// Error interceptor to log detailed errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ RESPONSE: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ ERROR: ${error.response?.status || "No response"}`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;