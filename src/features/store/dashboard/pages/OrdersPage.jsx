import { useEffect, useState } from "react";
import "../styles/orders.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setOrders([]);
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="orders-header-text">
          <p className="orders-subtitle">Management</p>
          <h1 className="orders-title">Orders</h1>
        </div>
      </div>

      {/* Total Orders Stat */}
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
            <p className="stat-value">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Order History Table */}
      <div className="orders-table-section">
        <h2 className="orders-section-title">Order History</h2>

        {loading ? (
          <div className="orders-loading">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <p>No orders yet. New orders will appear here.</p>
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
                {orders.map((order) => (
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
    </div>
  );
}

export default OrdersPage;
