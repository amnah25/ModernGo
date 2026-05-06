import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const storeName = localStorage.getItem("storeName") || "Store";
  const storePhoto = localStorage.getItem("storePhoto") || "";

  const storeInitials = storeName
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

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
    localStorage.removeItem("storePhoto");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="logo-img-box">
          <img src={logo} alt="ModernGo Logo" />
        </div>
        <span className="navbar-logo-text">ModernGo</span>
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
              {storePhoto ? (
                <img src={storePhoto} alt={storeName} className="store-avatar-img" />
              ) : (
                <span className="store-avatar">{storeInitials}</span>
              )}
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