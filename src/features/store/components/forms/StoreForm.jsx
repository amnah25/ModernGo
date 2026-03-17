import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../../services/api";
import LocationPicker from "./LocationPicker";

function StoreForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    categories: "",
  });

  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowMap(false);
    setError("");
  };

  const handleEditLocation = () => {
    setShowMap(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!location) {
      setError("Please select store location from the map.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        address: location.label || `Lat: ${location.lat}, Lng: ${location.lng}`,
        phone: form.phone.trim(),
        categories: form.categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
          address: location.label || `Lat: ${location.lat}, Lng: ${location.lng}`,
        },
      };

      const res = await api.post("/stores/register", payload);

      const token = res?.data?.data?.token || res?.data?.data?.storeToken;
      const storeId = res?.data?.data?.store?._id || res?.data?.data?.storeId;

      if (token) localStorage.setItem("storeToken", token);
      if (storeId) localStorage.setItem("storeId", storeId);
      if (form.name) localStorage.setItem("storeName", form.name.trim());

      navigate("/store/dashboard/products");
    } catch (err) {
      const issues =
        err?.response?.data?.cause?.validationErrors?.[0]?.issues || [];

      if (issues.length > 0) {
        const messages = issues.map((issue) => issue.message).join(" | ");
        setError(messages);
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Registration failed";

        setError(msg);
      }

      console.log("REGISTER ERROR FULL:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="row">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Select Store Location</label>

        {showMap ? (
          <LocationPicker setLocation={handleLocationSelect} />
        ) : (
          <div className="selected-location-box">
            <p className="selected-location-text">
              {location?.label || `Lat: ${location?.lat} | Lng: ${location?.lng}`}
            </p>

            <button
              type="button"
              className="edit-location-btn"
              onClick={handleEditLocation}
            >
              Edit location
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="categories"
          placeholder="Categories (electronics, phones...)"
          value={form.categories}
          onChange={handleChange}
          required
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="signup-btn" disabled={loading}>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>

      <p className="login-link">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </form>
  );
}

export default StoreForm;