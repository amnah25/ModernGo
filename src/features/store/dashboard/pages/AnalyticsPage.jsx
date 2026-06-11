import { useEffect, useState } from "react";
import "../styles/analytics.css";

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    // TODO: Connect to backend analytics API when available
    // Expected endpoint: GET /api/stores/{storeId}/analytics?range=7d|30d|90d
    // For now, showing placeholder state
    setLoading(false);
    setError("Analytics API endpoints are not yet available on the backend.");
  }, [timeRange]);

  // Sample data structure for when API is ready
  const sampleAnalytics = {
    revenue: 15420.50,
    revenueChange: 12.5,
    orders: 284,
    ordersChange: 8.3,
    customers: 156,
    customersChange: 5.2,
    avgOrderValue: 54.30,
    avgOrderValueChange: 3.8,
    chartData: [],
    topProducts: [],
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="analytics-header-text">
          <p className="analytics-subtitle">Business Intelligence</p>
          <h1 className="analytics-title">Analytics</h1>
          <p className="analytics-description">
            Track store performance, sales trends, customer behavior, and key metrics over time.
          </p>
        </div>

        <div className="time-range-selector">
          <button
            className={`time-btn ${timeRange === "7d" ? "active" : ""}`}
            onClick={() => setTimeRange("7d")}
          >
            7 Days
          </button>
          <button
            className={`time-btn ${timeRange === "30d" ? "active" : ""}`}
            onClick={() => setTimeRange("30d")}
          >
            30 Days
          </button>
          <button
            className={`time-btn ${timeRange === "90d" ? "active" : ""}`}
            onClick={() => setTimeRange("90d")}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="analytics-kpis">
        <div className="kpi-card">
          <div className="kpi-header">
            <h3>Total Revenue</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="kpi-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="kpi-value">${sampleAnalytics.revenue.toFixed(2)}</p>
          <p className={`kpi-change ${sampleAnalytics.revenueChange >= 0 ? "positive" : "negative"}`}>
            <span className="change-icon">
              {sampleAnalytics.revenueChange >= 0 ? "↑" : "↓"}
            </span>
            {Math.abs(sampleAnalytics.revenueChange).toFixed(1)}%
          </p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <h3>Total Orders</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="kpi-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.148.42-.24.63C9.149 5.409 9 5.193 9 5c0-1.105.895-2 2-2h3c1.105 0 2 .895 2 2 0 .193-.149.409-.368.643m-5.801 0A48.412 48.412 0 015.25 9a48.412 48.412 0 017.5-7.168M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="kpi-value">{sampleAnalytics.orders}</p>
          <p className={`kpi-change ${sampleAnalytics.ordersChange >= 0 ? "positive" : "negative"}`}>
            <span className="change-icon">
              {sampleAnalytics.ordersChange >= 0 ? "↑" : "↓"}
            </span>
            {Math.abs(sampleAnalytics.ordersChange).toFixed(1)}%
          </p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <h3>New Customers</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="kpi-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 001.591-.68m-15.6 0A9.37 9.37 0 0012 3c4.753 0 8.871 3.157 10.364 7.598M12 3c-4.753 0-8.871 3.157-10.364 7.598m15.6 0A9.37 9.37 0 0112 21m-8.371-7.598a9.38 9.38 0 002.625.372M12 21c4.753 0 8.871-3.157 10.364-7.598"
              />
            </svg>
          </div>
          <p className="kpi-value">{sampleAnalytics.customers}</p>
          <p className={`kpi-change ${sampleAnalytics.customersChange >= 0 ? "positive" : "negative"}`}>
            <span className="change-icon">
              {sampleAnalytics.customersChange >= 0 ? "↑" : "↓"}
            </span>
            {Math.abs(sampleAnalytics.customersChange).toFixed(1)}%
          </p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <h3>Avg Order Value</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="kpi-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 12.75h.008v.008H9.75V12.75zm0 2.25h.008v.008H9.75v-.008zm0 2.25h.008v.008H9.75v-.008zm0 2.25h.008v.008H9.75v-.008zM12 12.75c-.621 0-1.125.504-1.125 1.125v6.75c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125v-6.75c0-.621-.504-1.125-1.125-1.125h-2.25zm6-2.25c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V11.625c0-.621-.504-1.125-1.125-1.125h-2.25z"
              />
            </svg>
          </div>
          <p className="kpi-value">${sampleAnalytics.avgOrderValue.toFixed(2)}</p>
          <p className={`kpi-change ${sampleAnalytics.avgOrderValueChange >= 0 ? "positive" : "negative"}`}>
            <span className="change-icon">
              {sampleAnalytics.avgOrderValueChange >= 0 ? "↑" : "↓"}
            </span>
            {Math.abs(sampleAnalytics.avgOrderValueChange).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts Section */}
      {loading ? (
        <div className="analytics-loading">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      ) : error ? (
        <div className="analytics-error">
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
          <h3>Analytics Not Available</h3>
          <p>{error}</p>
          <p className="error-note">
            This page is ready for integration. Backend endpoints will provide comprehensive business analytics.
          </p>
        </div>
      ) : (
        <div className="analytics-charts">
          <div className="chart-card">
            <h3>Revenue Trend</h3>
            <div className="chart-placeholder">
              <p>Revenue chart will appear here</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 12.75h.008v.008H9.75V12.75zm0 2.25h.008v.008H9.75v-.008zm0 2.25h.008v.008H9.75v-.008zm0 2.25h.008v.008H9.75v-.008zM12 12.75c-.621 0-1.125.504-1.125 1.125v6.75c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125v-6.75c0-.621-.504-1.125-1.125-1.125h-2.25zm6-2.25c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V11.625c0-.621-.504-1.125-1.125-1.125h-2.25z"
                />
              </svg>
            </div>
          </div>

          <div className="chart-card">
            <h3>Top Products</h3>
            <div className="top-products-placeholder">
              <p>Top performing products will appear here</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
          </div>

          <div className="chart-card">
            <h3>Sales by Category</h3>
            <div className="chart-placeholder">
              <p>Sales breakdown by category will appear here</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z"
                />
              </svg>
            </div>
          </div>

          <div className="chart-card">
            <h3>Customer Growth</h3>
            <div className="chart-placeholder">
              <p>Customer acquisition trends will appear here</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 001.591-.68m-15.6 0A9.37 9.37 0 0112 3c4.753 0 8.871 3.157 10.364 7.598M12 3c-4.753 0-8.871 3.157-10.364 7.598"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
