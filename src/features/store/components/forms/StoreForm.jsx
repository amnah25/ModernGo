import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { storeRegister } from "../../../../services/storeAuthApi";
import LocationPicker from "./LocationPicker";

function StoreForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    categories: [],
  });

  const [categoryInput, setCategoryInput] = useState("");

  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showMap) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [showMap]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      setForm({
        ...form,
        categories: [...form.categories, categoryInput.trim()],
      });
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (index) => {
    setForm({
      ...form,
      categories: form.categories.filter((_, i) => i !== index),
    });
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
        address:
          location.label || `Lat: ${location.lat}, Lng: ${location.lng}`,
        phone: form.phone.trim(),
        categories: form.categories,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
          address:
            location.label || `Lat: ${location.lat}, Lng: ${location.lng}`,
        },
      };

      console.log("📤 Sending registration payload:", JSON.stringify(payload, null, 2));

      const res = await storeRegister(payload);

      console.log("📥 Registration response:", JSON.stringify(res?.data, null, 2));

      const resData = res?.data?.data;
      const token = resData?.token || resData?.storeToken;
      const storeId =
        resData?.store?._id ||
        resData?.storeId ||
        resData?._id;
      const storePhoto =
        resData?.store?.profilePhoto ||
        resData?.profilePhoto;

      if (token) localStorage.setItem("storeToken", token);
      if (storeId) localStorage.setItem("storeId", storeId);
      if (form.name) localStorage.setItem("storeName", form.name.trim());
      if (storePhoto) localStorage.setItem("storePhoto", storePhoto);

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
          err?.response?.status === 500
            ? `Server error: ${err?.response?.data?.details || "Unknown issue"}`
            : err?.message ||
          "Registration failed";

        console.error("Registration Error:", err.response?.data); // Debug log
        setError(msg);
      }
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
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <div className="password-field">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label>Select Store Location</label>

        {showMap ? (
          <LocationPicker setLocation={handleLocationSelect} />
        ) : (
          <div className="selected-location-box">
            <p className="selected-location-text">
              {location?.label ||
                `Lat: ${location?.lat} | Lng: ${location?.lng}`}
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
        <label>Categories</label>
        <div className="categories-container">
          <div className="categories-list">
            {form.categories.map((category, index) => (
              <div key={index} className="category-tag">
                <span>{category}</span>
                <button
                  type="button"
                  className="remove-category-btn"
                  onClick={() => handleRemoveCategory(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="category-input-wrapper">
            <input
              type="text"
              placeholder="Add category..."
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
            {categoryInput.trim() && (
              <button
                type="button"
                className="add-category-btn"
                onClick={handleAddCategory}
              >
                +
              </button>
            )}
          </div>
        </div>
        {form.categories.length === 0 && (
          <p className="hint-text">Add at least one category</p>
        )}
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