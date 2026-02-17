import { Outlet, NavLink } from "react-router-dom";
import "../styles/dashboard.css";

export default function StoreDashboardLayout() {
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