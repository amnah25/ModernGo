import api from "./api";

// ========== STORE AUTH ==========
export const storeRegister = (data) => 
  api.post("/stores/register", data, {
    headers: { "Content-Type": "application/json" },
  });
export const storeLogin = (data) => 
  api.post("/stores/login", data, {
    headers: { "Content-Type": "application/json" },
  });

// ========== STORE PUBLIC ==========
export const getAllStores = () => api.get("/stores");
export const getStoreById = (storeId) => api.get(`/stores/${storeId}`);
export const searchStores = (query) => api.get("/stores/search", { params: { query } });
export const getNearbyStores = (longitude, latitude, maxDistance = 5000) =>
  api.get("/stores/nearby", { params: { longitude, latitude, maxDistance } });
export const getStoresByCategory = (category) => api.get(`/stores/category/${category}`);

// ========== STORE PROTECTED ==========
export const updateStore = (storeId, data) => api.put(`/stores/${storeId}`, data);
export const updateStorePassword = (storeId, data) =>
  api.patch(`/stores/${storeId}/password`, data);
export const deleteStore = (storeId) => api.delete(`/stores/${storeId}`);

// ========== CUSTOMER AUTH ==========
export const customerRegister = (formData) =>
  api.post("/customers/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const customerLogin = (data) => api.post("/customers/login", data);

// ========== CUSTOMER PROTECTED ==========
export const getCustomerProfile = (customerId) =>
  api.get(`/customers/${customerId}`);
export const updateCustomerProfile = (customerId, data) =>
  api.patch(`/customers/${customerId}`, data);
export const updateCustomerPassword = (customerId, data) =>
  api.patch(`/customers/${customerId}/password`, data); 