import StoreForm from "../components/forms/StoreForm";
import "../styles/storeSignUp.css";

function StoreSignUp() {
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <StoreForm />
      </div>
    </div>
  );
}

export default StoreSignUp;
