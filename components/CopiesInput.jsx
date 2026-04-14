"use client";

/**
 * CopiesInput.jsx
 * Numeric stepper component for setting the number of copies.
 * Enforces minimum of 1. Accessible with keyboard support.
 *
 * Props:
 *   value    {number}   - current copies value
 *   onChange {function} - called with new numeric value
 *   id       {string}   - unique HTML id for the input
 */

export default function CopiesInput({ value, onChange, id = "copies-input" }) {
  const handleDecrement = () => {
    if (value > 1) onChange(value - 1);
  };

  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleInputChange = (e) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed) && parsed >= 1) onChange(parsed);
  };

  return (
    <div className="copies-input" role="group" aria-label="Copies">
      <button
        id={`${id}-decrement`}
        className="copies-btn"
        onClick={handleDecrement}
        disabled={value <= 1}
        aria-label="Decrease copies"
        type="button"
      >
        −
      </button>

      <input
        id={id}
        type="number"
        className="copies-number"
        value={value}
        min={1}
        onChange={handleInputChange}
        aria-label="Number of copies"
      />

      <button
        id={`${id}-increment`}
        className="copies-btn"
        onClick={handleIncrement}
        aria-label="Increase copies"
        type="button"
      >
        +
      </button>
    </div>
  );
}
