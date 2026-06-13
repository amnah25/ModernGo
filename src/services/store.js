import api from "./api";

export const storeRegister = (data) =>
  api.post("/stores/register", data, {
    headers: { "Content-Type": "application/json" },
  });

export const storeLogin = (data) =>
  api.post("/stores/login", data, {
    headers: { "Content-Type": "application/json" },
  });

export const getAllStores = () => api.get("/stores");
export const getStoreById = (storeId) => api.get(`/stores/${storeId}`);
export const getNearbyStores = (longitude, latitude, maxDistance = 5000) =>
  api.get("/stores/nearby", { params: { longitude, latitude, maxDistance } });
export const getStoresByCategory = (category) => api.get(`/stores/category/${category}`);

export const customerRegister = (formData) =>
  api.post("/customers/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
