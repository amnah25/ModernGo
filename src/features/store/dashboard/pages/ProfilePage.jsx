import { useEffect, useMemo, useState, useRef } from "react";
import { getStoreProfile, updateStoreProfile, uploadProfileImage, deleteProfileImage } from "../../../../services/storeSettingsApi";
import { validateEmail, validateRequired, validatePhoneNumber, validateImageFile, parseApiErrors } from "../../../../services/validationUtils";
import FormFieldError from "../../components/forms/FormFieldError";
import "../styles/profile.css";

function ProfilePage() {
  const storeId = useMemo(() => localStorage.getItem("storeId"), []);
  const storeName = localStorage.getItem("storeName") || "";
  const fileInputRef = useRef(null);
  const changePhotoInputRef = useRef(null);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    role: "Store Owner",
    storeName: "",
    storeAddress: "",
    profilePhoto: "",
    createdAt: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editFieldErrors, setEditFieldErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Image Upload State
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch profile on mount
  useEffect(() => {
    if (!storeId) {
      setEditFieldErrors((prev) => ({ ...prev, fullName: "Missing storeId. Please login again." }));
      setProfileLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setProfileLoading(true);

      try {
        const res = await getStoreProfile(storeId);
        const store = res?.data?.data || res?.data?.store || {};

        setProfileData({
          fullName: store.fullName || store.name || storeName || "",
          username: store.username || store.email?.split("@")[0] || "",
          email: store.email || "",
          phone: store.phone || "",
          role: store.role || "Store Owner",
          storeName: store.name || storeName || "",
          storeAddress: store.address || "",
          profilePhoto: store.profilePhoto || "",
          createdAt: store.createdAt || "",
        });
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load profile";
        setEditFieldErrors((prev) => ({ ...prev, fullName: msg }));
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [storeId, storeName]);

  // Get user initials for avatar
  const userInitials = profileData.fullName
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

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

  // Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      setImageError(error);
      setImagePreview("");
      setSelectedFile(null);
      return;
    }

    setImageError("");
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload profile image
  const handleUploadImage = async () => {
    if (!selectedFile) {
      setImageError("Please select an image first.");
      return;
    }

    setImageLoading(true);
    setImageError("");
    setImageSuccess("");

    try {
      const formData = new FormData();
      formData.append("profilePhoto", selectedFile);

      await uploadProfileImage(storeId, formData);

      setProfileData((prev) => ({
        ...prev,
        profilePhoto: imagePreview,
      }));

      localStorage.setItem("storePhoto", imagePreview);

      setImageSuccess("Profile picture uploaded successfully!");
      setSelectedFile(null);
      setImagePreview("");

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (changePhotoInputRef.current) changePhotoInputRef.current.value = "";

      setTimeout(() => setImageSuccess(""), 3000);
    } catch (err) {
      const apiErrors = parseApiErrors(err);
      if (Object.keys(apiErrors).length > 0) {
        setImageError(apiErrors.image || apiErrors.profilePhoto || Object.values(apiErrors)[0]);
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to upload image";
        setImageError(msg);
      }
    } finally {
      setImageLoading(false);
    }
  };

  // Remove profile image
  const handleRemoveImage = async () => {
    setImageLoading(true);
    setImageError("");
    setImageSuccess("");

    try {
      await deleteProfileImage(storeId);

      setProfileData((prev) => ({
        ...prev,
        profilePhoto: "",
      }));

      localStorage.removeItem("storePhoto");

      setImageSuccess("Profile picture removed successfully!");

      setTimeout(() => setImageSuccess(""), 3000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to remove image";
      setImageError(msg);
    } finally {
      setImageLoading(false);
    }
  };

  // Clear image preview
  const handleCancelImageUpload = () => {
    setSelectedFile(null);
    setImagePreview("");
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (changePhotoInputRef.current) changePhotoInputRef.current.value = "";
  };

  // Handle profile edit changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (editFieldErrors[name]) {
      setEditFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};

    errors.fullName = validateRequired(profileData.fullName, "Full Name");
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
    setProfileSuccess("");

    try {
      await updateStoreProfile(storeId, {
        name: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.storeAddress,
      });

      localStorage.setItem("storeName", profileData.fullName);
      setProfileSuccess("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err) {
      const apiErrors = parseApiErrors(err);
      if (Object.keys(apiErrors).length > 0) {
        setEditFieldErrors(apiErrors);
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update profile";
        setEditFieldErrors((prev) => ({ ...prev, fullName: msg }));
      }
    } finally {
      setProfileLoading(false);
    }
  };

  if (profileLoading && !isEditing) {
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
        <p>Manage your personal account information and profile</p>
      </div>

      <div className="profile-container">
        {/* Profile Header Section */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              {profileData.profilePhoto ? (
                <img
                  src={profileData.profilePhoto}
                  alt={profileData.fullName}
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar">{userInitials}</div>
              )}
            </div>
            <div className="profile-basic-info">
              <h2 className="profile-name">{profileData.fullName || "User"}</h2>
              <p className="profile-role">{profileData.role}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="profile-card">
          <div className="section-header">
            <div>
              <h2>Personal Information</h2>
              <p className="section-subtitle">
                {isEditing ? "Edit your personal details" : "Your account information"}
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

          {profileSuccess && (
            <div className="alert alert-success">
              <span>✓</span> {profileSuccess}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className={`form-group ${editFieldErrors.fullName ? "has-error" : ""}`}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  onBlur={(e) => {
                    const error = validateRequired(e.target.value, "Full Name");
                    if (error) setEditFieldErrors(prev => ({ ...prev, fullName: error }));
                  }}
                  className={editFieldErrors.fullName ? "input-error" : ""}
                  placeholder="Enter your full name"
                  required
                />
                {editFieldErrors.fullName && (
                  <FormFieldError error={editFieldErrors.fullName} />
                )}
              </div>

              <div className={`form-group ${editFieldErrors.email ? "has-error" : ""}`}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  onBlur={(e) => {
                    const error = validateEmail(e.target.value);
                    if (error) setEditFieldErrors(prev => ({ ...prev, email: error }));
                  }}
                  className={editFieldErrors.email ? "input-error" : ""}
                  placeholder="Enter your email"
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
                  onBlur={(e) => {
                    const error = validatePhoneNumber(e.target.value);
                    if (error) setEditFieldErrors(prev => ({ ...prev, phone: error }));
                  }}
                  className={editFieldErrors.phone ? "input-error" : ""}
                  placeholder="Enter your phone number"
                  required
                />
                {editFieldErrors.phone && (
                  <FormFieldError error={editFieldErrors.phone} />
                )}
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
                    setEditFieldErrors({ fullName: "", email: "", phone: "" });
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
                <span className="info-label">Full Name</span>
                <span className="info-value">{profileData.fullName || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Username</span>
                <span className="info-value">{profileData.username || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{profileData.email || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone</span>
                <span className="info-value">{profileData.phone || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role</span>
                <span className="info-value">{profileData.role || "Not set"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Store Information Section */}
        <div className="profile-card">
          <div className="section-header">
            <div>
              <h2>Store Information</h2>
              <p className="section-subtitle">Your store details</p>
            </div>
          </div>

          <div className="profile-info-display">
            <div className="info-row">
              <span className="info-label">Store Name</span>
              <span className="info-value">{profileData.storeName || "Not set"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Store Address</span>
              <span className="info-value">{profileData.storeAddress || "Not set"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Member Since</span>
              <span className="info-value">{formatDate(profileData.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Profile Image Management Section */}
        <div className="profile-card">
          <div className="section-header">
            <div>
              <h2>Profile Image</h2>
              <p className="section-subtitle">Upload, change, or remove your profile picture</p>
            </div>
          </div>

          {imageSuccess && (
            <div className="alert alert-success">
              <span>✓</span> {imageSuccess}
            </div>
          )}

          {imagePreview ? (
            <div className="image-upload-preview">
              <div className="preview-container">
                <img src={imagePreview} alt="Preview" className="preview-image" />
                <p className="preview-label">Preview</p>
              </div>

              <div className="preview-actions">
                <button
                  type="button"
                  className="btn-upload-preview"
                  onClick={handleUploadImage}
                  disabled={imageLoading}
                >
                  {imageLoading ? "Uploading..." : "Upload"}
                </button>
                <button
                  type="button"
                  className="btn-cancel-preview"
                  onClick={handleCancelImageUpload}
                  disabled={imageLoading}
                >
                  Cancel
                </button>
              </div>

              {imageError && (
                <FormFieldError error={imageError} />
              )}
            </div>
          ) : (
            <div className="image-upload-section">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />
              <input
                ref={changePhotoInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />

              <div className="image-action-buttons">
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {!profileData.profilePhoto ? (
                    <button
                      type="button"
                      className="btn-upload-new"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageLoading}
                    >
                      Upload New Photo
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn-change-photo"
                        onClick={() => changePhotoInputRef.current?.click()}
                        disabled={imageLoading}
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        className="btn-remove-photo"
                        onClick={handleRemoveImage}
                        disabled={imageLoading}
                      >
                        Remove Photo
                      </button>
                    </>
                  )}
                  {imageError && (
                    <FormFieldError error={imageError} />
                  )}
                </div>
              </div>

              <div className="image-format-info">
                <p className="format-title">Supported Formats</p>
                <p className="format-list">JPG, JPEG, PNG, WEBP</p>
                <p className="format-size">Maximum file size: 5MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;