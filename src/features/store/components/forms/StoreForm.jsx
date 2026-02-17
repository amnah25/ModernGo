import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log(form);

    // يروح على الداشبورد
    navigate("/store/dashboard/products");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />
      </div>

      <div className="row">
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="address"
          placeholder="Store Address"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="categories"
          placeholder="Categories (electronics, phones...)"
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="signup-btn">
        Sign Up
      </button>

      <p className="login-link">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </form>
  );
}

export default StoreForm;