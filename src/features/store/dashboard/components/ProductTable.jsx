import "../styles/products.css";
import api from "../../../../services/api";

export default function ProductTable({ products, onEdit, onDelete }) {
  const base = (api?.defaults?.baseURL || "").replace(/\/api\/?$/, "");

  const resolveImg = (raw) => {
    if (!raw) return null;

    if (
      raw.startsWith("http") ||
      raw.startsWith("blob:") ||
      raw.startsWith("data:")
    ) {
      return raw;
    }
    return `${base}${raw.startsWith("/") ? "" : "/"}${raw}`;
  };

  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Discount</th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6">
                <div className="table-empty-state">
                  <div className="table-empty-icon">
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                      />
                    </svg> */}
                  </div>
                  <h4>No products found</h4>
                  {/* <p>Try searching with another keyword or add a new product.</p> */}
                </div>
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const imgSrc = resolveImg(
                product?.image || product?.imageCover || ""
              );

              return (
                <tr key={product?._id || product?.storeProductId}>
                  <td>
                    <div className="product-image-box">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={product?.name || "product"}
                          className="product-thumb"
                        />
                      ) : (
                        <span className="no-image-text">No Image</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="product-name-cell">
                      <span className="product-name-text">
                        {product?.name || "-"}
                      </span>
                      {product?.description ? (
                        <span className="product-subtext">
                          {product.description.length > 45
                            ? `${product.description.slice(0, 45)}...`
                            : product.description}
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td>
                    <span className="price-text">
                      {product?.price ? `${product.price} EGP` : "-"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`stock-badge ${
                        Number(product?.stock) === 0
                          ? "out"
                          : Number(product?.stock) <= 10
                          ? "low"
                          : "good"
                      }`}
                    >
                      {product?.stock ?? 0}
                    </span>
                  </td>

                  <td>
                    <span className="discount-badge">
                      {product?.discount ? `${product.discount}%` : "0%"}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => onEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => onDelete(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}