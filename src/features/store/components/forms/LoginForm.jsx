import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { storeLogin } from "../../../../services/storeAuthApi";

function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

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

      navigate("/store/dashboard/products");
    } catch (err) {
      console.error("❌ Login error:", err);
      const server = err?.response?.data;

      let msg =
        server?.message ||
        server?.error ||
        (Array.isArray(server?.errors) ? server.errors.join(", ") : "") ||
        err?.message ||
        "Login failed";

      if (!msg && server) msg = JSON.stringify(server);

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <div className="form-group password-field">
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

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </button>

      <p className="login-link">
        Don’t have an account? <Link to="/store/signup">Sign Up</Link>
      </p>
    </form>
  );
}

export default LoginForm;