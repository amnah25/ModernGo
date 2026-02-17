import { useState } from "react";
import { productsMock } from "../mock/products.mock";
import ProductTable from "../components/ProductTable";
import AddProductModal from "../components/AddProductModal";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/products.css";

export default function ProductsPage() {
  const [products, setProducts] = useState(productsMock);

  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const handleSave = (product) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
    } else {
      setProducts((prev) => [...prev, product]);
    }

    setOpenForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products</h2>

        <button
          className="btn btn-add"
          onClick={() => {
            setEditingProduct(null);
            setOpenForm(true);
          }}
        >
          + Add Product
        </button>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddProductModal
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingProduct(null);
        }}
        onAdd={handleSave}
        initialData={editingProduct}
      />

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action can’t be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        danger
      />

    </div>
  );
}
