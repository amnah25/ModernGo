import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    navigate("/store/dashboard/products");
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

      <button type="submit" className="login-btn">
        Log In
      </button>

      <p className="login-link">
        Don’t have an account? <Link to="/">Sign Up</Link>
      </p>
    </form>
  );
}

export default LoginForm;