import { Navigate, Outlet } from "react-router-dom";

export default function RequireStoreAuth() {
  const token = localStorage.getItem("storeToken");
  return token ? <Outlet /> : <Navigate to="/store/login" replace />;
}