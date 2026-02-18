import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const storeName = localStorage.getItem("storeName") || "Store";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

const handleLogout = () => {
  setOpen(false);
  localStorage.removeItem("storeToken");
  localStorage.removeItem("storeId");
  localStorage.removeItem("storeName");
  navigate("/login");
};


  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🛒 ModernGo
      </Link>

      <div className="navbar-actions" ref={menuRef}>
        {location.pathname !== "/login" &&
          !location.pathname.startsWith("/store/dashboard") && (
            <Link to="/login" className="btn-login">
              Log In
            </Link>
          )}

        {location.pathname.startsWith("/store/dashboard") && (
          <div className="store-menu">
            <button
              type="button"
              className="store-menu-btn"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
            >
              <span className="store-avatar">{storeName.charAt(0)}</span>
              <span className="store-name">{storeName}</span>
              <span className={`caret ${open ? "open" : ""}`}>▾</span>
            </button>

            {open && (
              <div className="store-dropdown">
                <button type="button" className="dropdown-item">
                  Profile
                </button>
                <button type="button" className="dropdown-item">
                  Settings
                </button>

                <div className="dropdown-sep" />

                <button
                  type="button"
                  className="dropdown-item danger"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;