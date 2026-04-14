import api from "./api";

// ========== STORE-PRODUCT OPERATIONS (Store Owner) ==========
export const addProductToStore = (storeId, data) =>
  api.post(`/stores/${storeId}/products`, data);

export const updateStoreProduct = (storeId, productId, data) =>
  api.patch(`/stores/${storeId}/products/${productId}`, data);

export const removeProductFromStore = (storeId, productId) =>
  api.delete(`/stores/${storeId}/products/${productId}`);

// ========== STORE-PRODUCT QUERIES (Public) ==========
export const getStoreProducts = (storeId) =>
  api.get(`/stores/${storeId}/products`);
