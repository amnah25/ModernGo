import { useEffect, useMemo, useState } from "react";
import api from "../../../../services/api";
import { updateStoreSettings, updateStorePassword, deleteStore } from "../../../../services/storeSettingsApi";
import { validateRequired, validateEmail, validatePassword, validatePhoneNumber, parseApiErrors } from "../../../../services/validationUtils";
import FormFieldError from "../../components/forms/FormFieldError";
import "../styles/settings.css";

function SettingsPage() {
  const storeId = useMemo(() => localStorage.getItem("storeId"), []);
  const storeName = localStorage.getItem("storeName") || "";

  // Store Info Form State
  const [storeInfo, setStoreInfo] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    categories: [],
  });
  const [storeInfoLoading, setStoreInfoLoading] = useState(true);
  const [storeInfoSuccess, setStoreInfoSuccess] = useState("");
  const [storeInfoEditing, setStoreInfoEditing] = useState(false);

  // Store Info Field Errors
  const [storeInfoFieldErrors, setStoreInfoFieldErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Password Change Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Password Field Errors
  const [passwordFieldErrors, setPasswordFieldErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete Store State
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch store details on mount
  useEffect(() => {
    if (!storeId) {
      setStoreInfoFieldErrors((prev) => ({ ...prev, name: "Missing storeId. Please login again." }));
      setStoreInfoLoading(false);
      return;
    }

    const fetchStoreDetails = async () => {
      setStoreInfoLoading(true);
      setStoreInfoFieldErrors({ name: "", email: "", phone: "" });

      try {
        const res = await api.get(`/stores/${storeId}`);
        const store = res?.data?.data?.store || res?.data?.data || res?.data?.store || {};

        setStoreInfo({
          name: store.name || storeName,
          email: store.email || "",
          address: store.address || "",
          phone: store.phone || "",
          categories: Array.isArray(store.categories) ? store.categories : [],
        });
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load store details";
        setStoreInfoFieldErrors((prev) => ({ ...prev, name: msg }));
      } finally {
        setStoreInfoLoading(false);
      }
    };

    fetchStoreDetails();
  }, [storeId, storeName]);

  // Handle store info changes
  const handleStoreInfoChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setStoreInfoFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setStoreInfoSuccess("");
  };

  // Handle categories change
  const handleCategoriesChange = (e) => {
    const { value, checked } = e.target;
    setStoreInfo((prev) => {
      const categories = checked
        ? [...prev.categories, value]
        : prev.categories.filter((cat) => cat !== value);
      return { ...prev, categories };
    });
  };

  // Validate store info form
  const validateStoreInfo = () => {
    const errors = {};

    errors.name = validateRequired(storeInfo.name, "Store Name");
    errors.email = validateEmail(storeInfo.email);
    errors.phone = validatePhoneNumber(storeInfo.phone);

    return errors;
  };

  // Save store info
  const handleSaveStoreInfo = async (e) => {
    e.preventDefault();

    const errors = validateStoreInfo();
    if (Object.values(errors).some((err) => err)) {
      setStoreInfoFieldErrors(errors);
      return;
    }

    setStoreInfoLoading(true);
    setStoreInfoSuccess("");

    try {
      await updateStoreSettings(storeId, {
        name: storeInfo.name,
        email: storeInfo.email,
        address: storeInfo.address,
        phone: storeInfo.phone,
        categories: storeInfo.categories,
      });

      localStorage.setItem("storeName", storeInfo.name);
      setStoreInfoSuccess("Store settings updated successfully!");
      setStoreInfoEditing(false);

      setTimeout(() => setStoreInfoSuccess(""), 3000);
    } catch (err) {
      const apiErrors = parseApiErrors(err);

      if (Object.keys(apiErrors).length > 0) {
        setStoreInfoFieldErrors((prev) => ({ ...prev, ...apiErrors }));
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update store settings";
        setStoreInfoFieldErrors((prev) => ({ ...prev, name: msg }));
      }
    } finally {
      setStoreInfoLoading(false);
    }
  };

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setPasswordSuccess("");
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    errors.currentPassword = validateRequired(passwordData.currentPassword, "Current Password");
    errors.newPassword = validatePassword(passwordData.newPassword, 6);
    errors.confirmPassword = validateRequired(passwordData.confirmPassword, "Confirm Password");

    if (passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    const errors = validatePasswordForm();
    if (Object.values(errors).some((err) => err)) {
      setPasswordFieldErrors(errors);
      return;
    }

    setPasswordLoading(true);
    setPasswordSuccess("");

    try {
      await updateStorePassword(storeId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      const apiErrors = parseApiErrors(err);

      if (Object.keys(apiErrors).length > 0) {
        setPasswordFieldErrors((prev) => ({ ...prev, ...apiErrors }));
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to change password";
        setPasswordFieldErrors((prev) => ({ ...prev, currentPassword: msg }));
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete store
  const handleDeleteStore = async () => {
    setDeleteError("");
    setDeleteLoading(true);

    try {
      await deleteStore(storeId);
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete store";
      setDeleteError(msg);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Store Settings</h1>
        <p>Manage your store information, security, and preferences</p>
      </div>

      <div className="settings-container">
        {/* Store Information Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Store Information</h2>
            {!storeInfoEditing && (
              <button
                className="btn-edit"
                onClick={() => setStoreInfoEditing(true)}
                disabled={storeInfoLoading}
              >
                Edit
              </button>
            )}
          </div>

          {storeInfoSuccess && (
            <div className="alert alert-success">
              <span>✓</span> {storeInfoSuccess}
            </div>
          )}

          {storeInfoLoading && !storeInfoEditing ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading store details...</p>
            </div>
          ) : (
            <form onSubmit={handleSaveStoreInfo} className="settings-form">
              <div className={`form-group ${storeInfoFieldErrors.name ? "has-error" : ""}`}>
                <label htmlFor="name">Store Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={storeInfo.name}
                  onChange={handleStoreInfoChange}
                  onBlur={(e) => {
                    const error = validateRequired(e.target.value, "Store Name");
                    if (error) setStoreInfoFieldErrors(prev => ({ ...prev, name: error }));
                  }}
                  disabled={!storeInfoEditing || storeInfoLoading}
                  placeholder="Enter store name"
                  required
                />
                {storeInfoFieldErrors.name && <FormFieldError error={storeInfoFieldErrors.name} />}
              </div>

              <div className={`form-group ${storeInfoFieldErrors.email ? "has-error" : ""}`}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={storeInfo.email}
                  onChange={handleStoreInfoChange}
                  onBlur={(e) => {
                    const error = validateEmail(e.target.value);
                    if (error) setStoreInfoFieldErrors(prev => ({ ...prev, email: error }));
                  }}
                  disabled={!storeInfoEditing || storeInfoLoading}
                  placeholder="Enter email"
                  required
                />
                {storeInfoFieldErrors.email && <FormFieldError error={storeInfoFieldErrors.email} />}
              </div>

              <div className={`form-group ${storeInfoFieldErrors.phone ? "has-error" : ""}`}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={storeInfo.phone}
                  onChange={handleStoreInfoChange}
                  onBlur={(e) => {
                    const error = validatePhoneNumber(e.target.value);
                    if (error) setStoreInfoFieldErrors(prev => ({ ...prev, phone: error }));
                  }}
                  disabled={!storeInfoEditing || storeInfoLoading}
                  placeholder="Enter phone number"
                  required
                />
                {storeInfoFieldErrors.phone && <FormFieldError error={storeInfoFieldErrors.phone} />}
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={storeInfo.address}
                  onChange={handleStoreInfoChange}
                  disabled={!storeInfoEditing || storeInfoLoading}
                  placeholder="Enter store address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Categories</label>
                <div className="categories-grid">
                  {["electronics", "clothing", "food", "books", "accessories", "home"].map(
                    (category) => (
                      <label key={category} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={category}
                          checked={storeInfo.categories.includes(category)}
                          onChange={handleCategoriesChange}
                          disabled={!storeInfoEditing || storeInfoLoading}
                        />
                        <span className="checkbox-text">{category}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {storeInfoEditing && (
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={storeInfoLoading}
                  >
                    {storeInfoLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setStoreInfoEditing(false);
                      setStoreInfoFieldErrors({ name: "", email: "", phone: "" });
                    }}
                    disabled={storeInfoLoading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Change Password Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Security</h2>
          </div>

          {passwordSuccess && (
            <div className="alert alert-success">
              <span>✓</span> {passwordSuccess}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="settings-form">
            <div className={`form-group ${passwordFieldErrors.currentPassword ? "has-error" : ""}`}>
              <label htmlFor="currentPassword">Current Password *</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                onBlur={(e) => {
                  const error = validateRequired(e.target.value, "Current Password");
                  if (error) setPasswordFieldErrors(prev => ({ ...prev, currentPassword: error }));
                }}
                placeholder="Enter current password"
                disabled={passwordLoading}
                required
              />
              {passwordFieldErrors.currentPassword && <FormFieldError error={passwordFieldErrors.currentPassword} />}
            </div>

            <div className={`form-group ${passwordFieldErrors.newPassword ? "has-error" : ""}`}>
              <label htmlFor="newPassword">New Password *</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                onBlur={(e) => {
                  const error = validatePassword(e.target.value, 6);
                  if (error) setPasswordFieldErrors(prev => ({ ...prev, newPassword: error }));
                }}
                placeholder="Enter new password (min 6 characters)"
                disabled={passwordLoading}
                required
              />
              {passwordFieldErrors.newPassword && <FormFieldError error={passwordFieldErrors.newPassword} />}
            </div>

            <div className={`form-group ${passwordFieldErrors.confirmPassword ? "has-error" : ""}`}>
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                onBlur={(e) => {
                  let error = validateRequired(e.target.value, "Confirm Password");
                  if (!error && passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
                    error = "Passwords do not match";
                  }
                  if (error) setPasswordFieldErrors(prev => ({ ...prev, confirmPassword: error }));
                }}
                placeholder="Confirm new password"
                disabled={passwordLoading}
                required
              />
              {passwordFieldErrors.confirmPassword && <FormFieldError error={passwordFieldErrors.confirmPassword} />}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="section-header">
            <h2>Danger Zone</h2>
          </div>

          {deleteError && (
            <div className="alert alert-error">
              <span>⚠️</span> {deleteError}
            </div>
          )}

          <p className="danger-description">
            Deleting your store is permanent and cannot be undone. All your products and store data will be lost.
          </p>

          {!deleteConfirm ? (
            <button
              className="btn-delete"
              onClick={() => setDeleteConfirm(true)}
              disabled={deleteLoading}
            >
              Delete Store
            </button>
          ) : (
            <div className="delete-confirmation">
              <p className="confirmation-message">
                Are you sure you want to delete your store? This action cannot be undone.
              </p>
              <div className="confirmation-actions">
                <button
                  className="btn-delete"
                  onClick={handleDeleteStore}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete Store"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;