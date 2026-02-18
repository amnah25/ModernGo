import { useEffect, useState } from "react";
import api from "../../../../services/api";
import ProductTable from "../components/ProductTable";
import AddProductModal from "../components/AddProductModal";
import "../styles/products.css";

function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const storeId = localStorage.getItem("storeId");

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/stores/${storeId}/products`);
        const data = res?.data?.data;

        const raw = data?.products || data?.storeProducts || data || [];
        const arr = Array.isArray(raw) ? raw : [];

        const normalized = arr.map((p) => {
          if (p?.productId) return p;
          return { productId: p };
        });

        setItems(normalized);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load products";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (!storeId) {
      setError("Missing storeId. Please login again.");
      setLoading(false);
      return;
    }

    fetchProducts();
  }, [refreshKey]);

  const openAdd = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditItem(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const handleAddedOrEdited = () => {
    closeModal();
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = async (productId) => {
    const storeId = localStorage.getItem("storeId");
    if (!storeId) {
      setError("Missing storeId. Please login again.");
      return;
    }

    if (!productId) {
      setError("Missing productId.");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    setError("");

    try {
      await api.delete(`/stores/${storeId}/products/${productId}`);

      setItems((prev) =>
        prev.filter((p) => (p?.productId?._id || p?.productId) !== productId)
      );

      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log("DELETE ERROR =>", err?.response?.data || err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Delete failed";
      setError(msg);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="products-header">
        <h2 className="products-title">Products</h2>

        <button type="button" className="btn btn-add" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAdd={handleAddedOrEdited}
        initialData={editItem}
      />

      <ProductTable products={items} onEdit={openEdit} onDelete={handleDelete} />
    </div>
  );
}

export default ProductsPage;