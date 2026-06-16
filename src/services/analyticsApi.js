import api from "./api";

// ========== ANALYTICS ==========
export const getStoreSummary = (storeId, periodDays = 7) => 
  api.get(`/analytics/store/${storeId}/summary`, { params: { period: periodDays } });

export const getSalesChart = (storeId, periodDays = 7) => 
  api.get(`/analytics/store/${storeId}/sales-chart`, { params: { period: periodDays } });

export const getTopProducts = (storeId, periodDays = 7, limit = 5, sortBy = 'quantity') => 
  api.get(`/analytics/store/${storeId}/top-products`, { params: { period: periodDays, limit, sortBy } });

export const getOrderStatus = (storeId, periodDays = 7) => 
  api.get(`/analytics/store/${storeId}/order-status`, { params: { period: periodDays } });
