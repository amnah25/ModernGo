import api from "./api";

// ========== STORE SETTINGS (Protected - requires storeToken) ==========
export const updateStoreSettings = (storeId, data) =>
  api.put(`/stores/${storeId}`, data);

export const updateStorePassword = (storeId, data) =>
  api.patch(`/stores/${storeId}/password`, data);

export const deleteStore = (storeId) =>
  api.delete(`/stores/${storeId}`);

// ========== PROFILE IMAGE MANAGEMENT ==========
export const uploadProfileImage = (storeId, formData) =>
  api.post(`/stores/${storeId}/profile-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProfileImage = (storeId) =>
  api.delete(`/stores/${storeId}/profile-image`);

// ========== PROFILE (User Account Info) ==========
export const getStoreProfile = (storeId) => api.get(`/stores/${storeId}`);

export const updateStoreProfile = (storeId, data) => api.put(`/stores/${storeId}`, data);
