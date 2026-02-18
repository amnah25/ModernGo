import { useEffect, useState } from "react";
import api from "../../../../services/api";
import "../styles/modal.css";

export default function AddProductModal({ isOpen, onClose, onAdd, initialData }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    mainPrice: "",
    stock: "",
    discountPercent: "",
    slug: "",
    imageFile: null,
    imagePreview: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setLoading(false);

    if (initialData) {
      const prod = initialData?.productId || initialData;

      setForm({
        name: prod?.name ?? "",
        description: prod?.description ?? "",
        mainPrice: prod?.mainPrice ?? initialData?.price ?? "",
        stock: initialData?.stock ?? prod?.stock ?? "",
        discountPercent: prod?.discountPercent ?? "",
        slug: prod?.slug ?? "",
        imageFile: null,
        imagePreview:
          prod?.image ||
          (Array.isArray(prod?.images) ? prod.images[0] : "") ||
          "",
      });
      return;
    }

    setForm({
      name: "",
      description: "",
      mainPrice: "",
      stock: "",
      discountPercent: "",
      slug: "",
      imageFile: null,
      imagePreview: "",
    });
  }, [isOpen, initialData]);

  useEffect(() => {
    return () => {
      if (form.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: preview,
    }));
  };

  const buildSlug = (name, slug) => {
    const s = (slug || "").trim();
    if (s) return s;

    return (name || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storeId = localStorage.getItem("storeId");
    if (!storeId) {
      setError("Missing storeId. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const mainPrice = Number(form.mainPrice);
      const stock = Number(form.stock);
      const discountPercent = Number(form.discountPercent);

      if (!Number.isFinite(mainPrice) || mainPrice <= 0) {
        throw new Error("Invalid price");
      }
      if (!Number.isFinite(stock) || stock < 0) {
        throw new Error("Invalid stock");
      }
      if (!Number.isFinite(discountPercent) || discountPercent < 0) {
        throw new Error("Invalid discount");
      }

      if (!isEdit) {
        const fd = new FormData();
        fd.append("name", form.name.trim());
        fd.append("description", form.description.trim());
        fd.append("mainPrice", String(mainPrice));
        fd.append("stock", String(stock));
        fd.append("discountPercent", String(discountPercent));
        fd.append("slug", buildSlug(form.name, form.slug));
        if (form.imageFile) fd.append("images", form.imageFile);

        const createRes = await api.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const createdProduct = createRes?.data?.product || createRes?.data?.data?.product;
        const productId = createdProduct?._id;

        if (!productId) {
          throw new Error(createRes?.data?.message || "Product created but missing productId");
        }

        await api.post(`/stores/${storeId}/products`, {
          productId,
          price: mainPrice,
          stock,
          isAvailable: stock > 0,
        });

        onAdd?.(createdProduct);
        onClose();
        return;
      }

      const productId =
        initialData?.productId?._id ||
        initialData?.productId ||
        initialData?._id;

      if (!productId) throw new Error("Missing productId for edit");

      await api.patch(`/products/${productId}`, {
        name: form.name.trim(),
        description: form.description.trim(),
        mainPrice,
        stock,
        discountPercent,
      });

      await api.patch(`/stores/${storeId}/products/${productId}`, {
        price: mainPrice,
        stock,
        isAvailable: stock > 0,
      });

      if (form.imageFile) {
        const fd2 = new FormData();
        fd2.append("images", form.imageFile);

        await api.patch(`/products/${productId}/attachment`, fd2, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onAdd?.();
      onClose();
    } catch (err) {
      console.log("SAVE PRODUCT ERROR =>", err?.response?.data || err);

      const server = err?.response?.data;

      const msg =
        server?.message ||
        server?.error ||
        err?.message ||
        "something went wrong";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? "Edit Product" : "Add Product"}</h3>
          <button type="button" className="modal-close" onClick={onClose} disabled={loading}>
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
            <span>Slug</span>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="wireless-bt-headphones"
              required
            />
          </div>

          <div className="field">
            <span>Product Image</span>

            <label className="upload-btn">
              Upload Image
              <input type="file" accept="image/*" onChange={handleFile} hidden />
            </label>

            {form.imagePreview && (
              <img src={form.imagePreview} alt="preview" className="image-preview" />
            )}
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>

            <button type="submit" className="btn btn-add" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}