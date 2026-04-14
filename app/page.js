"use client";

/**
 * page.js — PrintEasy Print Configuration Interface
 */

import { useState } from "react";
import { PrintProvider } from "@/context/PrintContext";
import { usePrintConfig } from "@/hooks/usePrintConfig";
import DocumentPreview from "@/components/DocumentPreview";
import FileList from "@/components/FileList";
import TabBar from "@/components/TabBar";
import ConfigPanel from "@/components/ConfigPanel";
import BottomBar from "@/components/BottomBar";
import ReviewModal from "@/components/ReviewModal";

// ─── Price calc ───────────────────────────────────────────────────────────────
function calcPrice(files) {
  return files.reduce((total, file) => {
    const rate = file.sides === "double" ? 3 : 2;
    return total + file.originalPages * file.copies * rate;
  }, 0);
}

// ─── Inner App ────────────────────────────────────────────────────────────────
function PrintApp() {
  const { activeTab, setActiveTab, files, selectedFile, hasAnyDuplexError } =
    usePrintConfig();

  const [reviewOpen, setReviewOpen] = useState(false);

  const isAllTab = activeTab === "all";
  const price = calcPrice(files);

  return (
    <div className="app-bg">
      <div className="app-card">

        {/* ── Top Bar ─────────────────────────────────────────────────── */}
        {isAllTab ? (
          <header className="topbar" role="banner">
            <button id="btn-back" type="button" className="topbar__back" aria-label="Go back">←</button>
            <div className="topbar__center">
              <span className="topbar__ordering-at">Ordering At</span>
              <span className="topbar__brand">PrintEasy</span>
            </div>
            <div style={{ width: 36 }} />
          </header>
        ) : (
          <header role="banner">
            <div className="topbar">
              <button
                id="btn-back-files"
                type="button"
                className="topbar__back"
                aria-label="Back to all files"
                onClick={() => setActiveTab("all")}
              >
                ←
              </button>
              <div style={{ flex: 1 }} />
              <button
                id="btn-add-more"
                type="button"
                className="topbar__action"
                title="Adding more documents is out of scope — this assessment uses static file data"
                aria-label="Add more documents (static demo)"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add More
              </button>
            </div>
            <div className="topbar__subtitle">
              <span className="topbar__subtitle-dot" aria-hidden="true" />
              Files will be printed in the same order
            </div>
          </header>
        )}

        {/* ── Content above tabs ───────────────────────────────────────── */}
        {isAllTab ? <DocumentPreview /> : <FileList />}

        {/* ── Config Banner ────────────────────────────────────────────── */}
        <div className="config-banner">
          {isAllTab ? (
            <p className="config-banner__text">
              Changing print setting for{" "}
              <span className="config-banner__highlight">all files</span>
            </p>
          ) : (
            <p className="config-banner__text">
              Changing print settings for{" "}
              <span className="config-banner__highlight config-banner__highlight--file">
                {selectedFile?.name ?? "selected file"}
              </span>
            </p>
          )}
        </div>

        {/* ── Tab Bar ──────────────────────────────────────────────────── */}
        <TabBar />

        {/* ── Config Panel ─────────────────────────────────────────────── */}
        <ConfigPanel />

        {/* ── Bottom Bar ───────────────────────────────────────────────── */}
        <BottomBar
          price={price}
          hasError={hasAnyDuplexError}
          onReview={() => setReviewOpen(true)}
        />

        {/* ── Review Modal ─────────────────────────────────────────────── */}
        <ReviewModal
          isOpen={reviewOpen}
          onClose={() => setReviewOpen(false)}
          files={files}
          price={price}
        />
      </div>
    </div>
  );
}

// ─── Root with Provider ───────────────────────────────────────────────────────
export default function Page() {
  return (
    <PrintProvider>
      <PrintApp />
    </PrintProvider>
  );
}
