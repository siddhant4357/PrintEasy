"use client";

/**
 * FileList.jsx — Files tab: list of file cards with selection.
 */

import { usePrintConfig } from "@/hooks/usePrintConfig";

export default function FileList() {
  const { files, selectedFileId, setSelectedFile } = usePrintConfig();

  return (
    <div className="file-list-section">
      {files.map((file) => {
        const isSelected = selectedFileId === file.id;
        const hasOverride = file.overrides.size > 0;

        return (
          <button
            key={file.id}
            id={`file-card-${file.id}`}
            type="button"
            className={[
              "file-card",
              isSelected ? "file-card--selected" : "",
              file.duplexError ? "file-card--error" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setSelectedFile(file.id)}
            aria-pressed={isSelected}
            aria-label={`${file.name}${file.duplexError ? " — duplex error" : ""}`}
          >
            {/* Yellow brand icon */}
            <div className="file-card__icon" aria-hidden="true">
              PE
            </div>

            {/* File info */}
            <div className="file-card__info">
              <div className="file-card__name">{file.name}</div>
              <div className="file-card__meta">
                {file.originalPages}{" "}
                {file.originalPages === 1 ? "Page" : "Pages"} &middot; B&amp;W
              </div>

              {/* Override + error badges */}
              {(hasOverride || file.duplexError) && (
                <div className="file-card__badges">
                  {file.overrides.has("copies") && !file.duplexError && (
                    <span className="file-badge">
                      {file.copies} {file.copies === 1 ? "copy" : "copies"}
                    </span>
                  )}
                  {file.overrides.has("sides") && !file.duplexError && (
                    <span className="file-badge">
                      {file.sides === "double" ? "Double" : "Single"}
                    </span>
                  )}
                  {file.duplexError && (
                    <span className="file-badge file-badge--error">
                      ⚠ Fix duplex
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Kebab menu — static/decorative, out of assignment scope.
                Using div to avoid nested <button> HTML error. */}
            <div
              className="file-card__menu"
              role="img"
              aria-label={`Options for ${file.name} (not interactive)`}
            >
              ···
            </div>
          </button>
        );
      })}
    </div>
  );
}
