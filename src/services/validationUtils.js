/**
 * Validation utility functions
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return "";
};

export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return "";
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
};

export const validatePhoneNumber = (phone) => {
  if (!phone || !phone.trim()) {
    return "Phone number is required";
  }
  const phoneRegex = /^[0-9\s\-\+\(\)]{7,}$/;
  if (!phoneRegex.test(phone)) {
    return "Invalid phone number format";
  }
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} is required`;
  }
  return "";
};

export const validateNumber = (value, fieldName, min = 0, max = Infinity) => {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return `${fieldName} must be a valid number`;
  }
  if (num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  if (num > max) {
    return `${fieldName} must not exceed ${max}`;
  }
  return "";
};

export const validateMinLength = (value, fieldName, minLength) => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return "";
};

export const validateMaxLength = (value, fieldName, maxLength) => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return "";
};

/**
 * Parse backend validation errors and map to field names
 * Handles various API error response formats
 */
export const parseApiErrors = (error) => {
  const fieldErrors = {};

  if (!error) return fieldErrors;

  // Handle Zod validation errors (validationErrors format)
  if (error?.response?.data?.cause?.validationErrors) {
    const validationErrors = error.response.data.cause.validationErrors;
    validationErrors.forEach((ve) => {
      if (ve.issues && Array.isArray(ve.issues)) {
        ve.issues.forEach((issue) => {
          const path = issue.path?.[0] || "general";
          fieldErrors[path] = issue.message;
        });
      }
    });
  }

  // Handle field-specific errors object
  if (error?.response?.data?.errors && typeof error.response.data.errors === "object") {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      // Array of error objects
      errors.forEach((err) => {
        if (err.field && err.message) {
          fieldErrors[err.field] = err.message;
        }
      });
    } else {
      // Object with field names as keys
      Object.keys(errors).forEach((field) => {
        const msg = errors[field];
        fieldErrors[field] = typeof msg === "string" ? msg : msg.message || "Error";
      });
    }
  }

  // Handle single message as general error
  if (error?.response?.data?.message) {
    fieldErrors.general = error.response.data.message;
  }

  // Handle array of error messages
  if (error?.response?.data?.error && typeof error.response.data.error === "string") {
    fieldErrors.general = error.response.data.error;
  }

  return fieldErrors;
};

/**
 * Validate entire form based on rules
 */
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];

    if (typeof rule === "function") {
      const error = rule(value, formData);
      if (error) errors[field] = error;
    } else if (Array.isArray(rule)) {
      // Multiple validators for one field
      for (let validator of rule) {
        const error = validator(value, formData);
        if (error) {
          errors[field] = error;
          break; // Show first error only
        }
      }
    }
  });

  return errors;
};
