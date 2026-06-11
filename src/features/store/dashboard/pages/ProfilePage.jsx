import { useEffect, useMemo, useState } from "react";
import api from "../../../../services/api";
import { updateStoreSettings, updateStorePassword } from "../../../../services/storeSettingsApi";
import { validateEmail, validateRequired, validatePhoneNumber, validatePassword, validatePasswordMatch, parseApiErrors } from "../../../../services/validationUtils";
import FormFieldError from "../../components/forms/FormFieldError";
import "../styles/profile.css";

function ProfilePage() {
  const storeId = useMemo(() => localStorage.getItem("storeId"), []);
  const storeName = localStorage.getItem("storeName") || "";

  // Profile Data State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    categories: [],
    profilePhoto: "",
    createdAt: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editFieldErrors, setEditFieldErrors] = useState({});

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordFieldErrors, setPasswordFieldErrors] = useState({});

  // Fetch profile on mount
  useEffect(() => {
    if (!storeId) {
      setProfileError("Missing storeId. Please login again.");
      setProfileLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setProfileLoading(true);
      setProfileError("");

      try {
        const res = await api.get(`/stores/${storeId}`);
        const store = res?.data?.data || res?.data?.store || {};

        setProfileData({
          name: store.name || storeName,
          email: store.email || "",
          phone: store.phone || "",
          address: store.address || "",
          categories: Array.isArray(store.categories) ? store.categories : [],
          profilePhoto: store.profilePhoto || "",
          createdAt: store.createdAt || "",
        });
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load profile";
        setProfileError(msg);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [storeId, storeName]);

  // Get store initials for avatar
  const storeInitials = profileData.name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .toUpperCase()
    .join("");

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Handle profile edit changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setProfileError("");
    setProfileSuccess("");
    // Clear field error
    if (editFieldErrors[name]) {
      setEditFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};

    errors.name = validateRequired(profileData.name, "Store name");
    errors.email = validateEmail(profileData.email);
    errors.phone = validatePhoneNumber(profileData.phone);

    return errors;
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const errors = validateProfileForm();
    if (Object.values(errors).some((err) => err)) {
      setEditFieldErrors(errors);
      return;
    }

    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      await updateStoreSettings(storeId, {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        categories: profileData.categories,
      });

      localStorage.setItem("storeName", profileData.name);
      setProfileSuccess("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err) {
      const apiErrors = parseApiErrors(err);
      if (Object.keys(apiErrors).length > 0) {
        setEditFieldErrors(apiErrors);
        setProfileError("Please fix the errors below");
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update profile";
        setProfileError(msg);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password field changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
    setPasswordSuccess("");
    // Clear field error
    if (passwordFieldErrors[name]) {
      setPasswordFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    errors.currentPassword = validateRequired(passwordData.currentPassword, "Current password");
    errors.newPassword = validatePassword(passwordData.newPassword, 6);
    
    if (!errors.newPassword && passwordData.newPassword === passwordData.currentPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    if (!errors.newPassword && passwordData.newPassword) {
      errors.confirmPassword = validatePasswordMatch(
        passwordData.newPassword,
        passwordData.confirmPassword
      );
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
    setPasswordError("");
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
      setPasswordFieldErrors({});

      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      const apiErrors = parseApiErrors(err);
      if (Object.keys(apiErrors).length > 0) {
        setPasswordFieldErrors(apiErrors);
        setPasswordError("Please fix the errors below");
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to change password";
        setPasswordError(msg);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <h1>Profile</h1>
        </div>
        <div className="loading-state">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your store profile and account settings</p>
      </div>

      <div className="profile-container">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="avatar-container">
            {profileData.profilePhoto ? (
              <img
                src={profileData.profilePhoto}
                alt={profileData.name}
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar">{storeInitials}</div>
            )}
          </div>
          <div className="avatar-info">
            <h3>{profileData.name}</h3>
            <p className="role-badge">Store Owner</p>
            <p className="joined-date">
              Joined {formatDate(profileData.createdAt)}
            </p>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <div>
              <h2>Basic Information</h2>
              <p className="section-subtitle">
                {isEditing ? "Edit your store details" : "Your store profile details"}
              </p>
            </div>
            {!isEditing && (
              <button
                type="button"
                className="btn-edit"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {profileError && (
            <div className="alert alert-error">
              <span>⚠️</span> {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="alert alert-success">
              <span>✓</span> {profileSuccess}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className={`form-group ${editFieldErrors.name ? "has-error" : ""}`}>
                <label>Store Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className={editFieldErrors.name ? "input-error" : ""}
                  required
                />
                {editFieldErrors.name && (
                  <FormFieldError error={editFieldErrors.name} />
                )}
              </div>

              <div className={`form-group ${editFieldErrors.email ? "has-error" : ""}`}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={editFieldErrors.email ? "input-error" : ""}
                  required
                />
                {editFieldErrors.email && (
                  <FormFieldError error={editFieldErrors.email} />
                )}
              </div>

              <div className={`form-group ${editFieldErrors.phone ? "has-error" : ""}`}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className={editFieldErrors.phone ? "input-error" : ""}
                  required
                />
                {editFieldErrors.phone && (
                  <FormFieldError error={editFieldErrors.phone} />
                )}
              </div>

              <div className="form-group">
                <label>Store Address</label>
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  placeholder="Enter store address"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Categories</label>
                <div className="categories-display">
                  {profileData.categories.length > 0 ? (
                    <div className="categories-list">
                      {profileData.categories.map((category, idx) => (
                        <span key={idx} className="category-badge">
                          {category}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No categories selected</p>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-save"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setEditFieldErrors({});
                  }}
                  disabled={profileLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-display">
              <div className="info-row">
                <span className="info-label">Store Name</span>
                <span className="info-value">{profileData.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{profileData.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone</span>
                <span className="info-value">{profileData.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Address</span>
                <span className="info-value">
                  {profileData.address || "Not set"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Categories</span>
                <span className="info-value">
                  {profileData.categories.length > 0
                    ? profileData.categories.join(", ")
                    : "None"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="profile-section">
          <div className="section-header">
            <div>
              <h2>Security</h2>
              <p className="section-subtitle">Change your password</p>
            </div>
          </div>

          {passwordError && (
            <div className="alert alert-error">
              <span>⚠️</span> {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="alert alert-success">
              <span>✓</span> {passwordSuccess}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="password-form">
            <div className={`form-group ${passwordFieldErrors.currentPassword ? "has-error" : ""}`}>
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={passwordFieldErrors.currentPassword ? "input-error" : ""}
                placeholder="Enter current password"
                required
              />
              {passwordFieldErrors.currentPassword && (
                <FormFieldError error={passwordFieldErrors.currentPassword} />
              )}
            </div>

            <div className={`form-group ${passwordFieldErrors.newPassword ? "has-error" : ""}`}>
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={passwordFieldErrors.newPassword ? "input-error" : ""}
                placeholder="Enter new password"
                required
              />
              {passwordFieldErrors.newPassword && (
                <FormFieldError error={passwordFieldErrors.newPassword} />
              )}
            </div>

            <div className={`form-group ${passwordFieldErrors.confirmPassword ? "has-error" : ""}`}>
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={passwordFieldErrors.confirmPassword ? "input-error" : ""}
                placeholder="Confirm new password"
                required
              />
              {passwordFieldErrors.confirmPassword && (
                <FormFieldError error={passwordFieldErrors.confirmPassword} />
              )}
            </div>

            <button
              type="submit"
              className="btn-change-password"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
