import { Outlet, NavLink, Navigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function StoreDashboardLayout() {
  const token = localStorage.getItem("storeToken");
  const storeName = localStorage.getItem("storeName") || "Modern Go";
  const storePhoto = localStorage.getItem("storePhoto") || "";

  const storeInitials = storeName
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-top">
          {storePhoto ? (
            <img src={storePhoto} alt={storeName} className="sidebar-logo-img" />
          ) : (
            <div className="sidebar-logo">{storeInitials}</div>
          )}
          <div className="sidebar-store-info">
            <h3 className="sidebar-store-name">{storeName}</h3>
            <p className="sidebar-store-role">Store Dashboard</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-title">Main</p>

          <NavLink
            to="/store/dashboard/products"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="sidebar-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </span>
            <span className="sidebar-text">Products</span>
          </NavLink>

          <NavLink
            to="/store/dashboard/orders"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="sidebar-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h1.5l.4 2m0 0L6 10.5m-1.1-5.5h14.6a.75.75 0 0 1 .73.93l-1.2 4.5a.75.75 0 0 1-.73.57H6m-1.1-6 1.1 6m0 0h12.25M9 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </span>
            <span className="sidebar-text">Orders</span>
          </NavLink>

          <NavLink
            to="/store/dashboard/analytics"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="sidebar-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5 8.25 10l4.5 4.5L21 6.75"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 6.75H21v3.75"
                />
              </svg>
            </span>
            <span className="sidebar-text">Analytics</span>
          </NavLink>

          <p className="sidebar-section-title">Settings</p>

          <NavLink
            to="/store/dashboard/profile"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="sidebar-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.786 0-5.433-.648-7.951-1.827a1.75 1.75 0 0 1-.08-1.047l.324-.647A6.99 6.99 0 0 1 4.5 10.5v-.75c0-1.219.984-2.31 2.25-2.625V6A2.25 2.25 0 0 1 9 3.75h6A2.25 2.25 0 0 1 17.25 6v.125c1.266.315 2.25 1.405 2.25 2.625v.75a6.99 6.99 0 0 1-1.075 3.423l.324.647a1.75 1.75 0 0 1-.08 1.047 17.933 17.933 0 0 1-2.548 2.495l-.324-.647a5.25 5.25 0 0 0-2.776-1.122H9.168a5.25 5.25 0 0 0-2.776 1.122l-.324.647Z"
                />
              </svg>
            </span>
            <span className="sidebar-text">Profile</span>
          </NavLink>

          <NavLink
            to="/store/dashboard/settings"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="sidebar-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.527-.94 3.31.843 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.527-.843 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.527.94-3.31-.843-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.527.843-3.31 2.37-2.37.996.614 2.296.07 2.572-1.065Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
                />
              </svg>
            </span>
            <span className="sidebar-text">Settings</span>
          </NavLink>
        </nav>
      </aside>

      <main className="content">
        <div className="dashboard-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}