import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { storeRegister } from "../../../../services/store";
import { validateEmail, validateRequired, validatePassword, validatePasswordMatch, validatePhoneNumber, parseApiErrors } from "../../../../services/validationUtils";
import LocationPicker from "./LocationPicker";
import FormFieldError from "./FormFieldError";

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
  const [locationError, setLocationError] = useState("");
  const [showMap, setShowMap] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    categories: "",
    general: "",
  });

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
    setFieldErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    if (name === "confirmPassword" || name === "password") {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    let error = "";

    if (name === "name") {
      error = validateRequired(form.name, "Store Name");
    } else if (name === "email") {
      error = validateEmail(form.email);
    } else if (name === "password") {
      error = validatePassword(form.password, 6);
    } else if (name === "confirmPassword") {
      error = validatePasswordMatch(form.password, form.confirmPassword) || validateRequired(form.confirmPassword, "Confirm Password");
    } else if (name === "phone") {
      error = validatePhoneNumber(form.phone);
    }

    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      setForm({
        ...form,
        categories: [...form.categories, categoryInput.trim()],
      });
      setCategoryInput("");
      setFieldErrors((prev) => ({ ...prev, categories: "" }));
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
    setLocationError("");
    setFieldErrors((prev) => ({ ...prev, general: "" }));
  };

  const handleEditLocation = () => {
    setShowMap(true);
  };

  const validateForm = () => {
    const errors = {};

    errors.name = validateRequired(form.name, "Store Name");
    errors.email = validateEmail(form.email);
    errors.password = validatePassword(form.password, 6);
    errors.confirmPassword = validateRequired(form.confirmPassword, "Confirm Password") || validatePasswordMatch(form.password, form.confirmPassword);
    errors.phone = validatePhoneNumber(form.phone);

    if (form.categories.length === 0) {
      errors.categories = "Please add at least one category";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.values(errors).some((err) => err)) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    if (!location) {
      setLocationError("Please select store location from the map.");
      return;
    }

    setLoading(true);
    setFieldErrors({ name: "", email: "", password: "", confirmPassword: "", phone: "", categories: "", general: "" });
    setLocationError("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
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
      const apiErrors = parseApiErrors(err);

      if (Object.keys(apiErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...apiErrors }));
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.response?.status === 500
            ? `Server error: ${err?.response?.data?.details || "Unknown issue"}`
            : err?.message ||
          "Registration failed";

        console.error("Registration Error:", err.response?.data);
        setFieldErrors((prev) => ({ ...prev, general: msg }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={`form-group ${fieldErrors.name ? "has-error" : ""}`}>
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={fieldErrors.name ? "input-error" : ""}
          required
        />
        {fieldErrors.name && <FormFieldError error={fieldErrors.name} />}
      </div>

      <div className={`form-group ${fieldErrors.email ? "has-error" : ""}`}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={fieldErrors.email ? "input-error" : ""}
          required
        />
        {fieldErrors.email && <FormFieldError error={fieldErrors.email} />}
      </div>

      <div className="row">
        <div className={`form-field ${fieldErrors.password ? "has-error" : ""}`}>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldErrors.password ? "input-error" : ""}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {fieldErrors.password && <FormFieldError error={fieldErrors.password} />}
        </div>

        <div className={`form-field ${fieldErrors.confirmPassword ? "has-error" : ""}`}>
          <div className="password-field">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldErrors.confirmPassword ? "input-error" : ""}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirm((prev) => !prev)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {fieldErrors.confirmPassword && <FormFieldError error={fieldErrors.confirmPassword} />}
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
        {locationError && <FormFieldError error={locationError} />}
      </div>

      <div className={`form-group ${fieldErrors.phone ? "has-error" : ""}`}>
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={fieldErrors.phone ? "input-error" : ""}
          required
        />
        {fieldErrors.phone && <FormFieldError error={fieldErrors.phone} />}
      </div>

      <div className="form-footer">
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
          {fieldErrors.categories && <FormFieldError error={fieldErrors.categories} />}
        </div>

        {fieldErrors.general && (
          <p className="error-text">{fieldErrors.general}</p>
        )}

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </form>
  );
}

export default StoreForm;