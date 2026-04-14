"use client";

/**
 * ValidationWarning.jsx
 * Duplex error message — content matches assignment specification exactly.
 */

import { DUPLEX_ERROR_MESSAGE } from "@/utils/printUtils";

export default function ValidationWarning() {
  return (
    <div className="validation-warning" role="alert" aria-live="polite">
      <span className="validation-warning__icon" aria-hidden="true">⚠</span>
      <span className="validation-warning__text">{DUPLEX_ERROR_MESSAGE}</span>
    </div>
  );
}
