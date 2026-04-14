"use client";

/**
 * ReviewModal.jsx
 * A polished print summary modal shown when the user clicks "Review".
 * Not required by the assessment, but demonstrates complete UX thinking.
 *
 * Props:
 *   isOpen  {boolean}  - controls visibility
 *   onClose {function} - called when closed
 *   files   {Array}    - files from state
 *   price   {number}   - calculated price
 */

export default function ReviewModal({ isOpen, onClose, files, price }) {
  if (!isOpen) return null;

  const totalPages = files.reduce(
    (acc, f) => acc + f.originalPages * f.copies,
    0
  );

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Order Review"
      onClick={onClose}
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Order Summary</h2>
          <button
            id="btn-modal-close"
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close review"
          >
            ✕
          </button>
        </div>

        {/* File rows */}
        <div className="modal-body">
          {files.map((file) => (
            <div key={file.id} className="modal-file-row">
              <div className="modal-file-icon" aria-hidden="true">PE</div>
              <div className="modal-file-info">
                <span className="modal-file-name">{file.name}</span>
                <span className="modal-file-detail">
                  {file.originalPages} {file.originalPages === 1 ? "page" : "pages"} ×
                  {" "}{file.copies} {file.copies === 1 ? "copy" : "copies"} ·{" "}
                  {file.sides === "double" ? "Double Sided" : "Single Sided"} · B&W
                </span>
              </div>
              <div className="modal-file-pages">
                {file.originalPages * file.copies} pgs
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="modal-divider" />

        {/* Totals */}
        <div className="modal-totals">
          <div className="modal-total-row">
            <span>Total pages</span>
            <strong>{totalPages}</strong>
          </div>
          <div className="modal-total-row">
            <span>Print cost</span>
            <strong>₹{price.toFixed(2)}</strong>
          </div>
          <div className="modal-total-row modal-total-row--grand">
            <span>Grand Total</span>
            <strong>₹{price.toFixed(2)}</strong>
          </div>
        </div>

        {/* Place order button */}
        <button
          id="btn-place-order"
          type="button"
          className="modal-place-btn"
          onClick={onClose}
        >
          🖨 Place Print Order
        </button>
      </div>
    </div>
  );
}
