import LoginForm from "../components/forms/LoginForm";
import "../styles/storeLogin.css";

function StoreLogin() {
  return (
    <div className="login-container">
      <div className="login-card">

        <h2 className="login-title">Log In</h2>

        <LoginForm />

      </div>
    </div>
  );
}

export default StoreLogin;