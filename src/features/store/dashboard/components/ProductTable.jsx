import "../styles/products.css";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th className="td-name">Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Discount</th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            const prod = p?.productId || p;

            const productId = prod?._id;
            const name = prod?.name || "Unnamed";
            const price = prod?.mainPrice ?? prod?.price ?? p?.price ?? "-";
            const stock = p?.stock ?? prod?.stock ?? 0;
            const discount = prod?.discountPercent ?? 0;

            const image =
              prod?.image ||
              (Array.isArray(prod?.images) ? prod.images[0] : "") ||
              "https://via.placeholder.com/60";

            return (
              <tr key={p?._id || productId || name}>
                <td>
                  <img src={image} alt={name} />
                </td>

                <td className="td-name">{name}</td>
                <td>{price} EGP</td>
                <td>{stock}</td>
                <td>{discount}%</td>

                <td className="actions">
                  <button
                    type="button"
                    className="btn btn-edit"
                    onClick={() => onEdit?.(p)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-delete"
                    onClick={() => onDelete?.(productId)}
                    disabled={!productId}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}

          {products.length === 0 && (
            <tr>
              <td colSpan="6" className="empty">
                No products yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}