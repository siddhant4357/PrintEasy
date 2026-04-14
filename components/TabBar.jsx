"use client";

/**
 * TabBar.jsx — Reference-matched tab bar
 * [All] [Files] [Pages] with yellow dot indicator.
 */

import { usePrintConfig } from "@/hooks/usePrintConfig";

const TABS = [
  { id: "all",   label: "All" },
  { id: "files", label: "Files" },
  { id: "pages", label: "Pages", disabled: true },
];

export default function TabBar() {
  const { activeTab, setActiveTab, hasAnyDuplexError } = usePrintConfig();

  return (
    <div className="tab-bar" role="tablist" aria-label="Print configuration mode">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          type="button"
          aria-selected={activeTab === tab.id}
          aria-disabled={tab.disabled}
          className={[
            "tab-btn",
            activeTab === tab.id ? "tab-btn--active" : "",
            tab.disabled ? "tab-btn--disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => {
            if (!tab.disabled) setActiveTab(tab.id);
          }}
        >
          {tab.label}
          {tab.id === "files" && hasAnyDuplexError && activeTab !== "files" && (
            <span className="tab-error-badge" aria-label="Has errors" />
          )}
          <span className="tab-dot" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
