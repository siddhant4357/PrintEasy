"use client";

/**
 * ConfigPanel.jsx — Reference-matched config section
 *
 * Row 1: Print Type (A4) | Change (static) | Copies stepper
 * Row 2: Mode card (B&W, static) | Sides toggle — clearly showing Single/Double
 */

import { usePrintConfig } from "@/hooks/usePrintConfig";
import ValidationWarning from "./ValidationWarning";

export default function ConfigPanel() {
  const {
    activeTab,
    globalSettings,
    selectedFile,
    setGlobalCopies,
    setGlobalSides,
    setFileCopies,
    setFileSides,
  } = usePrintConfig();

  const isAllTab = activeTab === "all";

  // Effective display values
  const copies = isAllTab
    ? globalSettings.copies
    : (selectedFile?.copies ?? globalSettings.copies);

  const sides = isAllTab
    ? globalSettings.sides
    : (selectedFile?.sides ?? globalSettings.sides);

  const showDuplexError = !isAllTab && !!selectedFile?.duplexError;
  const copiesOverridden = !isAllTab && selectedFile?.overrides?.has("copies");
  const sidesOverridden  = !isAllTab && selectedFile?.overrides?.has("sides");

  const handleCopies = (val) => {
    const n = Math.max(1, val);
    isAllTab ? setGlobalCopies(n) : setFileCopies(selectedFile.id, n);
  };
  const handleSides = (val) => {
    isAllTab ? setGlobalSides(val) : setFileSides(selectedFile.id, val);
  };

  return (
    <div className="config-section">

      {/* ── Row 1: Print Type + Copies ─────────────────────────────────── */}
      <div className="config-row-1">
        {/* Print Type (static, out of scope) */}
        <div className="print-type-block">
          <span className="print-type-label">Print Type</span>
          <span className="print-type-value">A4</span>
          <span className="print-type-sub">Document</span>
        </div>

        {/* Change — static, print type is out of assignment scope */}
        <button
          id="btn-change-print-type"
          className="print-change-btn"
          type="button"
          title="Print type selection is out of scope for this assessment"
          aria-disabled="true"
        >
          Change
        </button>

        {/* Copies stepper */}
        <div className="copies-block">
          <div className="copies-label">
            Copies
            {copiesOverridden && (
              <span className="override-pill">Custom</span>
            )}
          </div>
          <div className="copies-stepper">
            <button
              id={isAllTab ? "global-copies-dec" : `file-copies-dec-${selectedFile?.id}`}
              type="button"
              className="copies-stepper__btn"
              onClick={() => handleCopies(copies - 1)}
              disabled={copies <= 1}
              aria-label="Decrease copies"
            >
              −
            </button>
            <input
              id={isAllTab ? "global-copies-val" : `file-copies-val-${selectedFile?.id}`}
              type="number"
              className="copies-stepper__val"
              value={copies}
              min={1}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) handleCopies(v);
              }}
              aria-label="Copies count"
            />
            <button
              id={isAllTab ? "global-copies-inc" : `file-copies-inc-${selectedFile?.id}`}
              type="button"
              className="copies-stepper__btn"
              onClick={() => handleCopies(copies + 1)}
              aria-label="Increase copies"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Mode (static) + Sides (interactive, both options shown) ── */}
      <div className="config-row-2">

        {/* Mode — static B&W, out of scope */}
        <div className="mode-card" title="B&W / Color selection is out of assignment scope">
          <div className="mode-icon" aria-hidden="true">
            <div className="mode-icon__half mode-icon__half--dark" />
            <div className="mode-icon__half mode-icon__half--light" />
          </div>
          <div className="card-text">
            <span className="card-text__label">Mode</span>
            <span className="card-text__val">B&amp;W</span>
          </div>
        </div>

        {/* Sides — interactive: shows both options as two stacked mini-buttons inside the card */}
        <div className={`sides-card${sides === "double" ? " sides-card--active" : ""}`}
             style={{ flexDirection: "column", alignItems: "stretch", gap: 6, padding: "10px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span className="card-text__label">
              Sides
              {sidesOverridden && (
                <span style={{
                  marginLeft: 5, background: "var(--yellow)", color: "var(--black)",
                  fontSize: 7, fontWeight: 800, padding: "1px 4px",
                  borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.3px",
                }}>Custom</span>
              )}
            </span>
          </div>

          {/* Single Sided option */}
          <button
            id={isAllTab ? "global-sides-single" : `file-sides-single-${selectedFile?.id}`}
            type="button"
            className={`sides-option-btn${sides === "single" ? " sides-option-btn--active" : ""}`}
            onClick={() => handleSides("single")}
            aria-pressed={sides === "single"}
          >
            <span className="sides-option-btn__check" aria-hidden="true">
              {sides === "single" ? "✓" : ""}
            </span>
            <span className="sides-option-icon" aria-hidden="true">
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                <rect x="0.5" y="0.5" width="15" height="17" rx="2.5" fill="white" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M3 5h10M3 8h10M3 11h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </span>
            <span className="sides-option-btn__label">Single</span>
          </button>

          {/* Double Sided option */}
          <button
            id={isAllTab ? "global-sides-double" : `file-sides-double-${selectedFile?.id}`}
            type="button"
            className={`sides-option-btn${sides === "double" ? " sides-option-btn--active" : ""}`}
            onClick={() => handleSides("double")}
            aria-pressed={sides === "double"}
          >
            <span className="sides-option-btn__check" aria-hidden="true">
              {sides === "double" ? "✓" : ""}
            </span>
            <span className="sides-option-icon" aria-hidden="true">
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                <rect x="4.5" y="2.5" width="15" height="15" rx="2.5" fill="white" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
                <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" fill="white" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M3 5h9M3 8h9M3 11h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </span>
            <span className="sides-option-btn__label">Double</span>
          </button>
        </div>
      </div>

      {/* ── Per-file duplex error ──────────────────────────────────────── */}
      {showDuplexError && <ValidationWarning />}

      {/* ── Global errors (All tab) ────────────────────────────────────── */}
      {isAllTab && <GlobalErrorSummary />}
    </div>
  );
}

/* ── Global error summary ────────────────────────────────────────────────── */
function GlobalErrorSummary() {
  const { files } = usePrintConfig();
  const errorFiles = files.filter((f) => f.duplexError);
  if (errorFiles.length === 0) return null;

  return (
    <div className="global-error-summary">
      <div className="global-error-summary__title">
        <span>⚠</span> Double Sided conflict detected
      </div>
      <ul className="global-error-summary__list">
        {errorFiles.map((f) => (
          <li key={f.id}>
            <span>·</span>
            <strong>{f.name}</strong>: {f.originalPages}{" "}
            {f.originalPages !== 1 ? "pages" : "page"} × {f.copies}{" "}
            {f.copies !== 1 ? "copies" : "copy"} = {f.originalPages * f.copies} total
            (need ≥ 2)
          </li>
        ))}
      </ul>
    </div>
  );
}
