import { useEffect, useState } from "react";
import "../styles/statsDetailModal.css";

function StatsDetailModal({ isOpen, onClose, statType, items }) {
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setFilteredItems([]);
      return;
    }

    let filtered = [];

    if (statType === "total") {
      filtered = items;
    } else if (statType === "lowStock") {
      filtered = items.filter(
        (item) => Number(item?.stock) > 0 && Number(item?.stock) <= 10
      );
    } else if (statType === "outOfStock") {
      filtered = items.filter((item) => Number(item?.stock) === 0);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [isOpen, statType, items, searchTerm]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (statType) {
      case "total":
        return "Total Products";
      case "lowStock":
        return "Low Stock Products";
      case "outOfStock":
        return "Out of Stock Products";
      default:
        return "Products";
    }
  };

  const getDescription = () => {
    switch (statType) {
      case "total":
        return "All products in your store";
      case "lowStock":
        return "Products with stock between 1-10 units";
      case "outOfStock":
        return "Products with no stock available";
      default:
        return "";
    }
  };

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="stats-modal-header">
          <h2>{getTitle()}</h2>
          <button className="stats-modal-close" onClick={onClose}>
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="stats-modal-description">{getDescription()}</p>

        <div className="stats-modal-search">
          <span className="stats-search-icon">
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
                d="M21 21l-4.35-4.35m1.6-5.65a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="stats-search-input"
          />
        </div>

        <div className="stats-modal-list">
          {filteredItems.length > 0 ? (
            <table className="stats-products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Discount</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td className="product-name">{item?.name || "N/A"}</td>
                    <td className="product-description">
                      {item?.description || "N/A"}
                    </td>
                    <td className="product-price">
                      {item?.price ? `${item.price} EGP` : "N/A"}
                    </td>
                    <td className="product-stock">
                      <span className={`stock-badge stock-${getStockStatus(item?.stock)}`}>
                        {item?.stock || 0}
                      </span>
                    </td>
                    <td className="product-discount">
                      {item?.discount ? `${item.discount}%` : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="stats-modal-empty">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m0 0C5.25 5.547 8.944 5 12 5c3.057 0 6.75.547 9 1.375"
                />
              </svg>
              <p>No products found</p>
            </div>
          )}
        </div>

        <div className="stats-modal-footer">
          <p className="stats-result-count">
            Showing {filteredItems.length} of {
              statType === "total"
                ? items.length
                : statType === "lowStock"
                ? items.filter(
                    (item) => Number(item?.stock) > 0 && Number(item?.stock) <= 10
                  ).length
                : items.filter((item) => Number(item?.stock) === 0).length
            }{" "}
            products
          </p>
        </div>
      </div>
    </div>
  );
}

function getStockStatus(stock) {
  const numStock = Number(stock);
  if (numStock === 0) return "out";
  if (numStock <= 10) return "low";
  return "normal";
}

export default StatsDetailModal;
