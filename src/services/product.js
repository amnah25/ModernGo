import api from "./api";

export const createProduct = (formData) =>
  api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (productId, data) =>
  api.patch(`/products/${productId}`, data);

export const updateProductAttachment = (productId, formData) =>
  api.patch(`/products/${productId}/attachment`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const freezeProduct = (productId) =>
  api.delete(`/products/${productId}/freeze`);

export const restoreProduct = (productId) =>
  api.patch(`/products/${productId}/restore`);

export const addProductToStore = (storeId, data) =>
  api.post(`/stores/${storeId}/products`, data);

export const updateStoreProduct = (storeId, productId, data) =>
  api.patch(`/stores/${storeId}/products/${productId}`, data);

export const removeProductFromStore = (storeId, productId) =>
  api.delete(`/stores/${storeId}/products/${productId}`);

export const getStoreProducts = (storeId) =>
  api.get(`/stores/${storeId}/products`);

export const getProductStores = (productId) =>
  api.get(`/products/${productId}/stores`);

export const getNearbyStoresForProduct = (
  productId,
  longitude,
  latitude,
  maxDistance = 5000
) =>
  api.get(`/products/${productId}/stores/nearby`, {
    params: { longitude, latitude, maxDistance },
  });

export const getNearbyStoresForProductByName = (
  query,
  longitude,
  latitude,
  maxDistance = 5000
) =>
  api.get("/products/stores/nearby", {
    params: { query, longitude, latitude, maxDistance },
  });
