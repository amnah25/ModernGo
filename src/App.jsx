import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./shared/Navbar/Navbar";
import Footer from "./shared/Footer/Footer";

import StoreSignUp from "./features/store/pages/StoreSignUp";
import StoreLogin from "./features/store/pages/StoreLogin";

import StoreDashboardLayout from "./features/store/dashboard/layout/StoreDashboardLayout";
import ProductsPage from "./features/store/dashboard/pages/ProductsPage";
import OrdersPage from "./features/store/dashboard/pages/OrdersPage";
import AnalyticsPage from "./features/store/dashboard/pages/AnalyticsPage";
import ProfilePage from "./features/store/dashboard/pages/ProfilePage";
import SettingsPage from "./features/store/dashboard/pages/SettingsPage";

import "leaflet/dist/leaflet.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<StoreSignUp />} />
        <Route path="/login" element={<StoreLogin />} />

        <Route path="/store/dashboard" element={<StoreDashboardLayout />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;