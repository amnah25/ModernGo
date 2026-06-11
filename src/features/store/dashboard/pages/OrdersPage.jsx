import { useEffect, useState } from "react";
import "../styles/orders.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // TODO: Connect to backend orders API when available
    // Expected endpoint: GET /api/stores/{storeId}/orders
    // For now, showing placeholder state
    setLoading(false);
    setError("Orders API endpoints are not yet available on the backend.");
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "all" ||
      order.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="orders-header-text">
          <p className="orders-subtitle">Management</p>
          <h1 className="orders-title">Orders</h1>
          <p className="orders-description">
            Track and manage all customer orders. View order status, customer details, and shipping information.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon processing">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.047.662M19.5 12a48.694 48.694 0 01-3.818 9.26m-2.318-9.26a48.694 48.694 0 00-5.512-9.26m0 0A4.5 4.5 0 0073.618 6M9 12a4.5 4.5 0 01 9 0"
              />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Processing</p>
            <p className="stat-value">{stats.processing}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon shipped">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m0 0H3m16.5 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m0 0H21m-9-12a9 9 0 100 18 9 9 0 000-18z"
              />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Shipped</p>
            <p className="stat-value">{stats.shipped}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon delivered">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Delivered</p>
            <p className="stat-value">{stats.delivered}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="orders-filters">
        <input
          type="text"
          placeholder="Search by order ID or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === "processing" ? "active" : ""}`}
            onClick={() => setFilter("processing")}
          >
            Processing
          </button>
          <button
            className={`filter-btn ${filter === "shipped" ? "active" : ""}`}
            onClick={() => setFilter("shipped")}
          >
            Shipped
          </button>
          <button
            className={`filter-btn ${filter === "delivered" ? "active" : ""}`}
            onClick={() => setFilter("delivered")}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        <div className="orders-error">
          <div className="error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c.866 1.5 2.926 2.871 5.303 2.871s4.437-1.372 5.303-2.87m0 0a24.848 24.848 0 015.404-3.7m-4.454-1.31c1.42-.923 2.944-1.426 4.454-1.426m0 0a23.94 23.94 0 015.422.756m-4.772 3.506a23.936 23.936 0 013.678-3.506m0 0A3 3 0 0027 10.464m-19.97.006a23.9 23.9 0 013.678 3.505m0 0a3 3 0 105.342 3.684"
              />
            </svg>
          </div>
          <h3>Orders API Not Available</h3>
          <p>{error}</p>
          <p className="error-note">
            This page is ready for integration. Backend endpoints will enable full functionality.
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m0 0C3.75 4.097 7.444 2.25 12 2.25s8.25 1.847 8.25 4.125"
              />
            </svg>
          </div>
          <h3>No Orders Found</h3>
          <p>
            {search ? "Try adjusting your search or filters" : "You don't have any orders yet"}
          </p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.orderId}</td>
                  <td className="customer-name">{order.customerName}</td>
                  <td className="order-total">${order.total?.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="order-date">{order.date}</td>
                  <td className="actions">
                    <button className="btn-view">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
