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
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img src={p.image} alt={p.name} />
              </td>

              <td className="td-name">{p.name}</td>
              <td>{p.mainPrice} EGP</td>
              <td>{p.stock}</td>
              <td>{p.discountPercent}%</td>

              <td className="actions">
                <button
                  type="button"
                  className="btn btn-edit"
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn-delete"
                  onClick={() => onDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

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
