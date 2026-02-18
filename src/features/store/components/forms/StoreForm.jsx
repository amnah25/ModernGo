import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../../services/api";

function StoreForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    categories: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const categoriesArr = form.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        address: form.address,
        phone: form.phone,
        location: {
          type: "Point",
          coordinates: [31.2357, 30.0444],
          address: form.address,
        },
        categories: categoriesArr,
      };

      const res = await api.post("/stores/register", payload);

      const token = res?.data?.data?.token;
      const store = res?.data?.data?.store;

      if (!token || !store?._id) {
        throw new Error("Registration succeeded but missing token/store data");
      }

      localStorage.setItem("storeToken", token);
      localStorage.setItem("storeId", store._id);
      if (store?.name) localStorage.setItem("storeName", store.name);

      navigate("/store/dashboard/products");
    } catch (err) {
      const server = err?.response?.data;

      console.log("REGISTER ERROR =>", server || err);

      const msg =
        server?.message ||
        (Array.isArray(server?.errors) ? server.errors.join(", ") : "") ||
        server?.error ||
        err?.message ||
        "Sign up failed";

      setError(msg || "Sign up failed");
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
        <input
          type="text"
          name="address"
          placeholder="Store Address"
          value={form.address}
          onChange={handleChange}
          required
        />
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
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <p className="login-link">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </form>
  );
}

export default StoreForm;