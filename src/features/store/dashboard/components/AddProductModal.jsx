import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { validateRequired, parseApiErrors } from "../../../../services/validationUtils";
import FormFieldError from "../../components/forms/FormFieldError";
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
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
    mainPrice: "",
    stock: "",
    discountPercent: "",
    slug: "",
    general: "",
  });

  const isEdit = Boolean(initialData);
  const base = (api?.defaults?.baseURL || "").replace(/\/api\/?$/, "");

  useEffect(() => {
    if (!isOpen) return;

    setFieldErrors({
      name: "",
      description: "",
      mainPrice: "",
      stock: "",
      discountPercent: "",
      slug: "",
      general: "",
    });
    setLoading(false);

    const resolveImg = (raw) => {
      if (!raw) return "";
      if (
        raw.startsWith("http") ||
        raw.startsWith("blob:") ||
        raw.startsWith("data:")
      ) {
        return raw;
      }
      return `${base}${raw.startsWith("/") ? "" : "/"}${raw}`;
    };

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
        imagePreview: resolveImg(
          prod?.image || (Array.isArray(prod?.images) ? prod.images[0] : "") || ""
        ),
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
  }, [isOpen, initialData, base]);

  useEffect(() => {
    return () => {
      if (form.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "name") {
      error = validateRequired(value, "Product Name");
    } else if (name === "description") {
      error = validateRequired(value, "Description");
    } else if (name === "mainPrice") {
      const num = Number(value);
      error = !Number.isFinite(num) || num <= 0 ? "Price must be a valid positive number" : "";
    } else if (name === "stock") {
      const num = Number(value);
      error = !Number.isFinite(num) || num < 0 ? "Stock must be a valid non-negative number" : "";
    } else if (name === "discountPercent") {
      const num = Number(value);
      error = !Number.isFinite(num) || num < 0 ? "Discount must be a valid non-negative number" : "";
    } else if (name === "slug") {
      error = validateRequired(value, "Slug");
    }

    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
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

  const validateForm = () => {
    const errors = {};

    const mainPrice = Number(form.mainPrice);
    const stock = Number(form.stock);
    const discountPercent = Number(form.discountPercent);

    errors.name = validateRequired(form.name, "Product Name");
    errors.description = validateRequired(form.description, "Description");
    errors.mainPrice = !Number.isFinite(mainPrice) || mainPrice <= 0
      ? "Price must be a valid positive number"
      : "";
    errors.stock = !Number.isFinite(stock) || stock < 0
      ? "Stock must be a valid non-negative number"
      : "";
    errors.discountPercent = !Number.isFinite(discountPercent) || discountPercent < 0
      ? "Discount must be a valid non-negative number"
      : "";
    errors.slug = validateRequired(buildSlug(form.name, form.slug), "Slug");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storeId = localStorage.getItem("storeId");
    if (!storeId) {
      setFieldErrors((prev) => ({ ...prev, general: "Missing storeId. Please login again." }));
      return;
    }

    // Validate form
    const errors = validateForm();
    if (Object.values(errors).some((err) => err)) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    setLoading(true);
    setFieldErrors((prev) => ({ ...prev, general: "" }));

    try {
      const mainPrice = Number(form.mainPrice);
      const stock = Number(form.stock);
      const discountPercent = Number(form.discountPercent);

      if (!isEdit) {
        const fd = new FormData();
        fd.append("name", form.name.trim());
        fd.append("description", form.description.trim());
        fd.append("mainPrice", String(mainPrice));
        fd.append("stock", String(stock));
        fd.append("discountPercent", String(discountPercent));
        fd.append("slug", buildSlug(form.name, form.slug));
        fd.append("assistFolderId", "moderngo-products");

        if (form.imageFile) {
          fd.append("images", form.imageFile);
        }

        const createRes = await api.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const createdProduct =
          createRes?.data?.data?.product ||
          createRes?.data?.product ||
          createRes?.data?.data ||
          createRes?.data;

        const productId = createdProduct?._id;

        if (!productId) {
          throw new Error(
            createRes?.data?.message || "Product created but missing productId"
          );
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

      if (!productId) {
        setFieldErrors((prev) => ({ ...prev, general: "Missing productId for edit" }));
        return;
      }

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

      const apiErrors = parseApiErrors(err);

      if (Object.keys(apiErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...apiErrors }));
      } else {
        const server = err?.response?.data;
        const msg =
          server?.message ||
          server?.error ||
          err?.message ||
          "Something went wrong";

        setFieldErrors((prev) => ({ ...prev, general: msg }));
      }
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
          <div className={`field ${fieldErrors.name ? "has-error" : ""}`}>
            <span>Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldErrors.name ? "input-error" : ""}
              required
            />
            {fieldErrors.name && <FormFieldError error={fieldErrors.name} />}
          </div>

          <div className={`field ${fieldErrors.description ? "has-error" : ""}`}>
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldErrors.description ? "input-error" : ""}
              required
              rows="3"
            />
            {fieldErrors.description && <FormFieldError error={fieldErrors.description} />}
          </div>

          <div className="form-row">
            <div className={`field ${fieldErrors.mainPrice ? "has-error" : ""}`}>
              <span>Price</span>
              <input
                name="mainPrice"
                type="number"
                step="0.01"
                value={form.mainPrice}
                onChange={handleChange}
                onBlur={handleBlur}
                className={fieldErrors.mainPrice ? "input-error" : ""}
                required
              />
              {fieldErrors.mainPrice && <FormFieldError error={fieldErrors.mainPrice} />}
            </div>

            <div className={`field ${fieldErrors.stock ? "has-error" : ""}`}>
              <span>Stock</span>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                className={fieldErrors.stock ? "input-error" : ""}
                required
              />
              {fieldErrors.stock && <FormFieldError error={fieldErrors.stock} />}
            </div>
          </div>

          <div className="form-row">
            <div className={`field ${fieldErrors.discountPercent ? "has-error" : ""}`}>
              <span>Discount %</span>
              <input
                name="discountPercent"
                type="number"
                value={form.discountPercent}
                onChange={handleChange}
                onBlur={handleBlur}
                className={fieldErrors.discountPercent ? "input-error" : ""}
                required
              />
              {fieldErrors.discountPercent && <FormFieldError error={fieldErrors.discountPercent} />}
            </div>

            <div className={`field ${fieldErrors.slug ? "has-error" : ""}`}>
              <span>Slug</span>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                onBlur={handleBlur}
                className={fieldErrors.slug ? "input-error" : ""}
                placeholder="wireless-bt-headphones"
                required
              />
              {fieldErrors.slug && <FormFieldError error={fieldErrors.slug} />}
            </div>
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

          {fieldErrors.general && <p className="error-text">{fieldErrors.general}</p>}

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