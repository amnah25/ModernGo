import "../styles/modal.css";

export default function ConfirmModal({
  isOpen,
  onClose,
  title = "Confirm",
  description = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  danger = true,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal modal-sm" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="confirm-row">
            <div className={`confirm-icon ${danger ? "danger" : ""}`}>!</div>
            <div>
              <p className="confirm-text">{description}</p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              {cancelText}
            </button>

            <button
              type="button"
              className={`btn ${danger ? "btn-delete" : "btn-add"}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
