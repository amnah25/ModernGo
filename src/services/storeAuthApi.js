import api from "../../../services/api";

export const storeRegister = (data) => api.post("/stores/register", data);
export const storeLogin = (data) => api.post("/stores/login", data);
export const getStoreProfile = () => api.get("/stores/profile"); 