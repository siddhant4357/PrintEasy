"use client";

/**
 * usePrintConfig.js
 * Ergonomic custom hook that consumes PrintContext and exposes
 * clean action dispatchers + derived state selectors.
 */

import { usePrintContext, ACTIONS } from "@/context/PrintContext";

export function usePrintConfig() {
  const { state, dispatch } = usePrintContext();

  // ─── Derived State ──────────────────────────────────────────────────────────

  const selectedFile = state.files.find((f) => f.id === state.selectedFileId) ?? state.files[0];

  const hasAnyDuplexError = state.files.some((f) => f.duplexError);

  // ─── Action Dispatchers ─────────────────────────────────────────────────────

  /** Set global copies (propagates to non-overridden files) */
  const setGlobalCopies = (copies) =>
    dispatch({ type: ACTIONS.SET_GLOBAL_COPIES, payload: copies });

  /** Set global sides (propagates to non-overridden files) */
  const setGlobalSides = (sides) =>
    dispatch({ type: ACTIONS.SET_GLOBAL_SIDES, payload: sides });

  /** Set copies for a specific file + mark as overridden */
  const setFileCopies = (fileId, copies) =>
    dispatch({ type: ACTIONS.SET_FILE_COPIES, payload: { fileId, copies } });

  /** Set sides for a specific file + mark as overridden */
  const setFileSides = (fileId, sides) =>
    dispatch({ type: ACTIONS.SET_FILE_SIDES, payload: { fileId, sides } });

  /** Switch active tab */
  const setActiveTab = (tab) =>
    dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab });

  /** Select a file in the [Files] tab */
  const setSelectedFile = (fileId) =>
    dispatch({ type: ACTIONS.SET_SELECTED_FILE, payload: fileId });

  return {
    // State
    globalSettings: state.globalSettings,
    files: state.files,
    activeTab: state.activeTab,
    selectedFileId: state.selectedFileId,
    selectedFile,
    hasAnyDuplexError,

    // Actions
    setGlobalCopies,
    setGlobalSides,
    setFileCopies,
    setFileSides,
    setActiveTab,
    setSelectedFile,
  };
}
