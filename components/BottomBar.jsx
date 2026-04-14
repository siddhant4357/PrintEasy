"use client";

/**
 * BottomBar.jsx
 * Options button (black square) + Review pill (yellow).
 *
 * Props:
 *   price    {number}   - calculated print price
 *   hasError {boolean}  - disables Review if duplex errors exist
 *   onReview {function} - called when Review is clicked
 */

export default function BottomBar({ price, hasError, onReview }) {
  return (
    <div className="bottom-bar">
      {/* Options button — static, out of assessment scope */}
      <button
        id="btn-options"
        type="button"
        className="options-btn"
        title="Advanced options (out of scope for this assessment)"
        aria-label="Print options"
      >
        <div className="options-btn__icon" aria-hidden="true">
          <div className="options-btn__dot" />
          <div className="options-btn__dot" />
          <div className="options-btn__dot" />
          <div className="options-btn__dot" />
        </div>
        <span className="options-btn__label">Options</span>
      </button>

      {/* Review pill — functional, opens order summary modal */}
      <button
        id="btn-review"
        type="button"
        className="review-btn"
        disabled={hasError}
        onClick={onReview}
        aria-label={
          hasError
            ? "Cannot review — resolve duplex errors first"
            : `Review order — ₹${price.toFixed(2)}`
        }
      >
        Review
        <span className="review-btn__price">₹{price.toFixed(2)}</span>
      </button>
    </div>
  );
}
