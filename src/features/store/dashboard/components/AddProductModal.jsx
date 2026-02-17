import { useEffect, useState } from "react";
import "../styles/modal.css";

export default function AddProductModal({ isOpen, onClose, onAdd, initialData }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    mainPrice: "",
    stock: "",
    discountPercent: "",
    image: "",
  });

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        mainPrice: initialData.mainPrice ?? "",
        stock: initialData.stock ?? "",
        discountPercent: initialData.discountPercent ?? "",
        image: initialData.image ?? "",
      });
      return;
    }

    setForm({
      name: "",
      description: "",
      mainPrice: "",
      stock: "",
      discountPercent: "",
      image: "",
    });
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: initialData ? initialData.id : Date.now(),
      name: form.name.trim(),
      description: form.description.trim(),
      mainPrice: Number(form.mainPrice),
      stock: Number(form.stock),
      discountPercent: Number(form.discountPercent),
      image: form.image || "https://via.placeholder.com/100",
    };

    onAdd(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? "Edit Product" : "Add Product"}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <span>Name</span>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="field">
              <span>Price</span>
              <input
                name="mainPrice"
                type="number"
                step="0.01"
                value={form.mainPrice}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="field">
              <span>Stock</span>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <span>Discount %</span>
              <input
                name="discountPercent"
                type="number"
                value={form.discountPercent}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <span>Product Image</span>

            <label className="upload-btn">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const imageUrl = URL.createObjectURL(file);

                  setForm((prev) => ({
                    ...prev,
                    image: imageUrl,
                  }));
                }}
                hidden
              />
            </label>

            {form.image && (
              <img src={form.image} alt="preview" className="image-preview" />
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn btn-add">
              {isEdit ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
