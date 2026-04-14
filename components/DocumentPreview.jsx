"use client";

/**
 * DocumentPreview.jsx
 * Shows a stacked paper visual + document count + file names + print badge.
 * Displayed in the [All] tab.
 */

import { usePrintConfig } from "@/hooks/usePrintConfig";

export default function DocumentPreview() {
  const { files, globalSettings } = usePrintConfig();

  const fileNames = files.map((f) => f.name).join(", ");
  const truncated =
    fileNames.length > 36 ? fileNames.slice(0, 33) + "..." : fileNames;

  const sidesLabel =
    globalSettings.sides === "double" ? "Double" : "Single";

  return (
    <div className="doc-preview">
      {/* Stacked papers visual */}
      <div className="doc-preview__stack">
        <div className="doc-preview__paper doc-preview__paper--back" />
        <div className="doc-preview__paper doc-preview__paper--mid" />
        <div className="doc-preview__paper doc-preview__paper--front">
          <div className="doc-preview__paper-lines">
            <div className="doc-preview__line" />
            <div className="doc-preview__line" />
            <div className="doc-preview__line" />
          </div>
          <div className="doc-preview__paper-stripe" />
        </div>
      </div>

      {/* Info */}
      <div className="doc-preview__info">
        <div className="doc-preview__count">
          {files.length} {files.length === 1 ? "Document" : "Documents"}
        </div>
        <div className="doc-preview__names">Includes {truncated}</div>
      </div>

      {/* Badge */}
      <div className="doc-preview__badge">
        A4 · B&amp;W · {sidesLabel}
      </div>
    </div>
  );
}
