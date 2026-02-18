import { Routes, Route } from "react-router-dom";
import Navbar from "./shared/Navbar/Navbar";
import Footer from "./shared/Footer/Footer";

import StoreSignUp from "./features/store/pages/StoreSignUp";
import StoreLogin from "./features/store/pages/StoreLogin";

import StoreDashboardLayout from "./features/store/dashboard/layout/StoreDashboardLayout";
import ProductsPage from "./features/store/dashboard/pages/ProductsPage";

import ProtectedRoute from "./shared/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<StoreSignUp />} />
        <Route path="/login" element={<StoreLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/store/dashboard" element={<StoreDashboardLayout />}>
            <Route path="products" element={<ProductsPage />} />
          </Route>
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;