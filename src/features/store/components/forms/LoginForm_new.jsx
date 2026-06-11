import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { storeLogin } from "../../../../services/storeAuthApi";
import { validateEmail, validateRequired, parseApiErrors } from "../../../../services/validationUtils";
import FormFieldError from "./FormFieldError";

function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    setFieldErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    // Validate on blur
    let error = "";
    if (name === "email") {
      error = validateEmail(form.email);
    } else if (name === "password") {
      error = validateRequired(form.password, "Password");
    }
    
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    errors.email = validateEmail(form.email);
    errors.password = validateRequired(form.password, "Password");
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validate form
    const errors = validateForm();
    if (Object.values(errors).some((err) => err)) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    setLoading(true);
    setFieldErrors({ email: "", password: "", general: "" });

    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      console.log("📤 Sending login payload:", JSON.stringify(payload, null, 2));

      const res = await storeLogin(payload);

      console.log("✅ Login response:", res?.data);

      const data = res?.data?.data || res?.data;

      const token = data?.token;
      const store = data?.store;

      if (!token) throw new Error("Token not returned");

      localStorage.setItem("storeToken", token);

      if (store?._id) localStorage.setItem("storeId", store._id);
      if (store?.name) localStorage.setItem("storeName", store.name);
      if (store?.profilePhoto) localStorage.setItem("storePhoto", store.profilePhoto);

      navigate("/store/dashboard/products");
    } catch (err) {
      console.error("❌ Login error:", err);
      
      // Parse API errors and map to fields
      const apiErrors = parseApiErrors(err);
      
      if (Object.keys(apiErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...apiErrors }));
      } else {
        const server = err?.response?.data;
        let msg =
          server?.message ||
          server?.error ||
          (Array.isArray(server?.errors) ? server.errors.join(", ") : "") ||
          err?.message ||
          "Login failed";

        if (!msg && server) msg = JSON.stringify(server);
        setFieldErrors((prev) => ({ ...prev, general: msg }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <div className={`form-group password-field ${fieldErrors.password ? "has-error" : ""}`}>
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
        <span
          className="toggle-password"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>
        {fieldErrors.password && <FormFieldError error={fieldErrors.password} />}
      </div>

      {fieldErrors.general && (
        <div style={{ marginBottom: "12px", padding: "10px", background: "#fee2e2", color: "#991b1b", borderRadius: "6px", fontSize: "13px", border: "1px solid #fecac8" }}>
          {fieldErrors.general}
        </div>
      )}

      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </button>

      <p className="login-link">
        Don't have an account? <Link to="/store/signup">Sign Up</Link>
      </p>
    </form>
  );
}

export default LoginForm;
