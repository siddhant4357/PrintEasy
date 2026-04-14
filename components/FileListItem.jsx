"use client";

/**
 * FileListItem.jsx
 * Renders a single file row in the sidebar.
 * Shows override badges and error indicator.
 *
 * Props:
 *   file       {Object}  - the file object from state
 *   isSelected {boolean} - whether this file is currently selected
 *   onClick    {function}- callback when this row is clicked
 */

export default function FileListItem({ file, isSelected, onClick }) {
  const hasOverride = file.overrides.size > 0;
  const copiesOverridden = file.overrides.has("copies");
  const sidesOverridden = file.overrides.has("sides");

  return (
    <button
      id={`file-list-item-${file.id}`}
      className={`file-item${isSelected ? " file-item--selected" : ""}${file.duplexError ? " file-item--error" : ""}`}
      onClick={onClick}
      type="button"
      aria-pressed={isSelected}
      aria-label={`${file.name}${file.duplexError ? ", has duplex error" : ""}`}
    >
      {/* File icon */}
      <div className="file-item__icon" aria-hidden="true">
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
          <rect x="0.5" y="0.5" width="21" height="25" rx="3.5" fill="white" stroke="currentColor" />
          <path d="M5 7h12M5 11h12M5 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* File info */}
      <div className="file-item__info">
        <span className="file-item__name">{file.name}</span>
        <span className="file-item__meta">
          {file.originalPages} {file.originalPages === 1 ? "page" : "pages"}
        </span>

        {/* Override badges */}
        {hasOverride && (
          <div className="file-item__badges">
            {copiesOverridden && (
              <span className="badge badge--override" title="Custom copies applied">
                {file.copies} {file.copies === 1 ? "copy" : "copies"}
              </span>
            )}
            {sidesOverridden && (
              <span className="badge badge--override" title="Custom sides applied">
                {file.sides === "double" ? "Double" : "Single"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error indicator */}
      {file.duplexError && (
        <span className="file-item__error-dot" aria-hidden="true" title="Duplex error" />
      )}

      {/* Chevron for selected */}
      {isSelected && (
        <span className="file-item__chevron" aria-hidden="true">›</span>
      )}
    </button>
  );
}
