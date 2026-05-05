import { useEffect, useMemo, useState } from "react";
import api from "../../../../services/api";
import ProductTable from "../components/ProductTable";
import AddProductModal from "../components/AddProductModal";
import ConfirmModal from "../components/ConfirmModal";
import StatsDetailModal from "../components/StatsDetailModal";
import "../styles/products.css";

function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [isStatsDetailOpen, setIsStatsDetailOpen] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const storeId = useMemo(() => localStorage.getItem("storeId"), []);

  useEffect(() => {
    if (!storeId) {
      setError("Missing storeId. Please login again.");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/stores/${storeId}/products`);
        const data = res?.data?.data;

        const raw = data?.products || data?.storeProducts || data || [];
        const arr = Array.isArray(raw) ? raw : [];

        const normalized = arr
          .map((p) => {
            if (!p) return null;

            if (p.productId && typeof p.productId === "object") {
              return {
                storeProductId: p._id,
                ...p.productId,
                price: p.price,
                stock: p.stock,
                discount: p.productId?.discountPercent || 0,
                isAvailable: p.isAvailable,
              };
            }

            if (p.productId && typeof p.productId === "string") {
              return {
                storeProductId: p._id,
                _id: p.productId,
                price: p.price,
                stock: p.stock,
                discount: p.discountPercent || 0,
                isAvailable: p.isAvailable,
              };
            }

            return {
              storeProductId: p._id,
              ...p,
            };
          })
          .filter(Boolean);

        setItems(normalized);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load products";

        setError(msg);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeId, refreshKey]);

  const openAdd = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const openStatsDetail = (statType) => {
    setSelectedStatType(statType);
    setIsStatsDetailOpen(true);
  };

  const closeStatsDetail = () => {
    setIsStatsDetailOpen(false);
    setSelectedStatType(null);
  };

  const openEdit = (row) => {
    setEditItem(row);
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

  const handleDelete = (row) => {
    setDeleteItem(row);
  };

  const confirmDelete = async () => {
    const sid = localStorage.getItem("storeId");
    const productId = deleteItem?._id;

    try {
      await api.delete(`/stores/${sid}/products/${productId}`);
      setItems((prev) => prev.filter((p) => p?._id !== productId));
      setDeleteItem(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Delete failed";

      setError(msg);
    }
  };

  const filteredItems = items.filter((item) => {
    const name = item?.name || "";
    const description = item?.description || "";
    const value = search.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(value) ||
      description.toLowerCase().includes(value);

    if (!matchesSearch) return false;

    // Apply filter type
    const stock = Number(item?.stock) || 0;
    if (filterType === "all") return true;
    if (filterType === "lowStock") return stock > 0 && stock <= 10;
    if (filterType === "outOfStock") return stock === 0;
    if (filterType === "inStock") return stock > 10;

    return true;
  });

  const totalProducts = items.length;
  const lowStockCount = items.filter(
    (item) => Number(item?.stock) > 0 && Number(item?.stock) <= 10
  ).length;
  const outOfStockCount = items.filter(
    (item) => Number(item?.stock) === 0
  ).length;

  return (
    <div className="products-page fade-in-page">
      <div className="products-shell">
        <div className="products-page-header">
          <div className="products-header-text">
            <p className="products-subtitle">Dashboard / Products</p>
            <h2 className="products-title">Products</h2>
            <p className="products-description">
              Manage your store products, stock and pricing.
            </p>
          </div>

          <button type="button" className="btn-add" onClick={openAdd}>
            <span className="btn-add-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </span>
            Add Product
          </button>
        </div>

        <div className="products-stats">
          <div 
            className="stat-card slide-up delay-1" 
            onClick={() => openStatsDetail("total")}
            role="button"
            tabIndex={0}
          >
            <div className="stat-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="stat-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                />
              </svg>
            </div>
            <div>
              <p className="stat-label">Total Products</p>
              <h3 className="stat-value">{totalProducts}</h3>
            </div>
          </div>

          <div 
            className="stat-card slide-up delay-2" 
            onClick={() => openStatsDetail("lowStock")}
            role="button"
            tabIndex={0}
          >
            <div className="stat-icon warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="stat-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374l7.355-12.75c.866-1.5 3.03-1.5 3.896 0l7.355 12.75Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5h.007v.008H12V16.5Z"
                />
              </svg>
            </div>
            <div>
              <p className="stat-label">Low Stock</p>
              <h3 className="stat-value">{lowStockCount}</h3>
            </div>
          </div>

          <div 
            className="stat-card slide-up delay-3" 
            onClick={() => openStatsDetail("outOfStock")}
            role="button"
            tabIndex={0}
          >
            <div className="stat-icon danger">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="stat-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75 14.25 14.25m0-4.5-4.5 4.5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <p className="stat-label">Out of Stock</p>
              <h3 className="stat-value">{outOfStockCount}</h3>
            </div>
          </div>
        </div>

        <div className="products-toolbar">
          <div className="products-toolbar-left">
            <div className="search-box">
              <span className="search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="search-svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.6-5.65a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button type="button" className="toolbar-btn active-filter">
              All Products
            </button>

            <button type="button" className="toolbar-btn">
              Sort by: Default
            </button>
          </div>

          <div className="products-toolbar-right">
            <div className="filter-dropdown-container">
              <button 
                type="button" 
                className="toolbar-btn"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                Filter
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`filter-icon ${filterOpen ? "open" : ""}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {filterOpen && (
                <div className="filter-dropdown-menu">
                  <button
                    type="button"
                    className={`filter-option ${filterType === "all" ? "active" : ""}`}
                    onClick={() => {
                      setFilterType("all");
                      setFilterOpen(false);
                    }}
                  >
                    All Products
                  </button>
                  <button
                    type="button"
                    className={`filter-option ${filterType === "inStock" ? "active" : ""}`}
                    onClick={() => {
                      setFilterType("inStock");
                      setFilterOpen(false);
                    }}
                  >
                    In Stock ({'>'}10)
                  </button>
                  <button
                    type="button"
                    className={`filter-option ${filterType === "lowStock" ? "active" : ""}`}
                    onClick={() => {
                      setFilterType("lowStock");
                      setFilterOpen(false);
                    }}
                  >
                    Low Stock (1-10)
                  </button>
                  <button
                    type="button"
                    className={`filter-option ${filterType === "outOfStock" ? "active" : ""}`}
                    onClick={() => {
                      setFilterType("outOfStock");
                      setFilterOpen(false);
                    }}
                  >
                    Out of Stock
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}

        <div className="products-table-card">
          <div className="table-card-header">
            <div>
              <h3 className="table-card-title">Products List</h3>
              <p className="table-card-subtitle">
                Showing {filteredItems.length} of {items.length} products
              </p>
            </div>
          </div>

          {loading ? (
            <div className="products-state">Loading products...</div>
          ) : (
            <ProductTable
              products={filteredItems}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        <AddProductModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onAdd={handleAddedOrEdited}
          initialData={editItem}
        />

        <ConfirmModal
          isOpen={!!deleteItem}
          title="Delete Product"
          message="Are you sure you want to delete this product?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteItem(null)}
        />

        <StatsDetailModal
          isOpen={isStatsDetailOpen}
          onClose={closeStatsDetail}
          statType={selectedStatType}
          items={items}
        />
      </div>
    </div>
  );
}

export default ProductsPage;