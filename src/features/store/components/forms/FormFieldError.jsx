/**
 * FormFieldError Component
 * Displays validation error messages below form fields
 */

function FormFieldError({ error }) {
  if (!error) return null;

  return <p className="field-error-text">{error}</p>;
}

export default FormFieldError;
