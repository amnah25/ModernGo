import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  getStoreSummary,
  getSalesChart,
  getTopProducts,
  getOrderStatus
} from "../../../../services/analyticsApi";
import "../styles/analytics.css";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#ff5c8d"];

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("7d");
  const [sortBy, setSortBy] = useState("quantity"); // 'quantity' or 'revenue'
  
  const [summary, setSummary] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const storeId = localStorage.getItem("storeId");
      if (!storeId) {
        setError("Store ID not found. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      
      const periodDays = parseInt(timeRange.replace('d', ''));

      try {
        const [summaryRes, salesRes, productsRes, statusRes] = await Promise.all([
          getStoreSummary(storeId, periodDays),
          getSalesChart(storeId, periodDays),
          getTopProducts(storeId, periodDays, 5, sortBy),
          getOrderStatus(storeId, periodDays)
        ]);

        setSummary(summaryRes.data?.data || null);
        setSalesChart(salesRes.data?.data || []);
        setTopProducts(productsRes.data?.data || []);
        
        // Format order status data to map status -> name
        const rawStatus = statusRes.data?.data || [];
        const formattedStatus = rawStatus.map(item => ({
          ...item,
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1)
        }));
        setOrderStatus(formattedStatus);

      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, sortBy]);

  const renderKpiValue = (kpi) => {
    if (!kpi) return 0;
    return kpi.value;
  };
  
  const renderKpiChange = (kpi) => {
    if (!kpi) return null;
    return (
      <p className={`kpi-change ${kpi.isPositive ? "positive" : "negative"}`}>
        <span className="change-icon">
          {kpi.isPositive ? "↑" : "↓"}
        </span>
        {Math.abs(kpi.trend).toFixed(1)}%
      </p>
    );
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

      {loading ? (
        <div className="analytics-loading">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      ) : error ? (
        <div className="analytics-error">
          <div className="error-icon">⚠️</div>
          <h3>Analytics Not Available</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="analytics-kpis">
            <div className="kpi-card">
              <div className="kpi-header">
                <h3>Total Revenue</h3>
              </div>
              <p className="kpi-value">${renderKpiValue(summary?.totalRevenue)?.toFixed(2)}</p>
              {renderKpiChange(summary?.totalRevenue)}
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <h3>Total Orders</h3>
              </div>
              <p className="kpi-value">{renderKpiValue(summary?.totalOrders)}</p>
              {renderKpiChange(summary?.totalOrders)}
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <h3>New Customers</h3>
              </div>
              <p className="kpi-value">{renderKpiValue(summary?.newCustomers)}</p>
              {renderKpiChange(summary?.newCustomers)}
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <h3>Avg Order Value</h3>
              </div>
              <p className="kpi-value">${renderKpiValue(summary?.avgOrderValue)?.toFixed(2)}</p>
              {renderKpiChange(summary?.avgOrderValue)}
            </div>
          </div>

          {/* Charts Section */}
          <div className="analytics-charts">
            <div className="chart-card chart-full-width" style={{ gridColumn: '1 / -1' }}>
              <h3>Revenue Trend</h3>
              <div className="chart-wrapper" style={{ height: 350, width: '100%', marginTop: '20px' }}>
                {salesChart.length === 0 ? (
                  <p>No revenue data for this period.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesChart}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Top Products</h3>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    background: '#f8fafc',
                    cursor: 'pointer'
                  }}
                >
                  <option value="quantity">By Quantity</option>
                  <option value="revenue">By Revenue</option>
                </select>
              </div>
              <div className="top-products-list" style={{ marginTop: '20px', flex: 1 }}>
                {topProducts.length === 0 ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b' }}>
                    <p>No product sales data</p>
                  </div>
                ) : (
                  topProducts.map((p, idx) => (
                    <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: idx !== topProducts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ 
                          width: '32px', height: '32px', 
                          background: idx === 0 ? '#fef08a' : idx === 1 ? '#e2e8f0' : idx === 2 ? '#ffedd5' : '#f8fafc', 
                          color: idx < 3 ? '#000' : '#64748b',
                          borderRadius: '8px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          {idx + 1}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', color: '#0f172a' }}>{p.name}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{p.totalQuantity} sold</p>
                        </div>
                      </div>
                      <div style={{ fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center' }}>
                        ${p.totalRevenue.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="chart-card">
              <h3>Order Status Breakdown</h3>
              <div className="chart-wrapper" style={{ height: 300, width: '100%', marginTop: '20px' }}>
                {orderStatus.length === 0 ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b' }}>
                    <p>No orders in this period</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="status"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {orderStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} Orders`, name]} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
