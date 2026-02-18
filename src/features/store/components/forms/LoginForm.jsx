import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../../services/api";

function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/stores/login", {
        email: form.email,
        password: form.password,
      });

      const token = res?.data?.data?.token;
      const store = res?.data?.data?.store;

      if (!token) throw new Error("Token not returned");

      localStorage.setItem("storeToken", token);

      if (store?._id) localStorage.setItem("storeId", store._id);
      if (store?.name) localStorage.setItem("storeName", store.name);

      navigate("/store/dashboard/products");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";
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

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </button>

      <p className="login-link">
        Don’t have an account? <Link to="/">Sign Up</Link>
      </p>
    </form>
  );
}

export default LoginForm;