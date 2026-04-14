"use client";

/**
 * SidesSelector.jsx
 * Toggle button group for selecting Single or Double sided printing.
 *
 * Props:
 *   value    {"single" | "double"} - current value
 *   onChange {function}            - called with "single" | "double"
 *   id       {string}              - unique HTML id prefix
 */

export default function SidesSelector({ value, onChange, id = "sides-selector" }) {
  const options = [
    { value: "single", label: "Single Sided", icon: "▭" },
    { value: "double", label: "Double Sided", icon: "▬" },
  ];

  return (
    <div
      className="sides-selector"
      role="group"
      aria-label="Sides"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          id={`${id}-${opt.value}`}
          type="button"
          className={`sides-btn${value === opt.value ? " sides-btn--active" : ""}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
        >
          <span className="sides-btn__icon" aria-hidden="true">{opt.icon}</span>
          <span className="sides-btn__label">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
