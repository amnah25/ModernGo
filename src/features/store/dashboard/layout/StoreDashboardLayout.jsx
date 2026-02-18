import { Outlet, NavLink, Navigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function StoreDashboardLayout() {
  const token = localStorage.getItem("storeToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">

      <aside className="sidebar sidebar-mini">
        <div className="sidebar-logo">MG</div>

        <nav className="sidebar-nav">
          <NavLink
            to="/store/dashboard/products"
            className={({ isActive }) =>
              isActive ? "side-icon active" : "side-icon"
            }
          >
            🧺
          </NavLink>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>

    </div>
  );
}