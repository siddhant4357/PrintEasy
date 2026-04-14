"use client";

/**
 * PrintContext.jsx
 * Global state provider using useReducer + useContext.
 * All components access print state through this context.
 */

import { createContext, useContext, useReducer } from "react";
import { printReducer, initialState, ACTIONS } from "@/reducers/printReducer";

// ─── Context Creation ─────────────────────────────────────────────────────────

const PrintContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PrintProvider({ children }) {
  const [state, dispatch] = useReducer(printReducer, initialState);

  return (
    <PrintContext.Provider value={{ state, dispatch }}>
      {children}
    </PrintContext.Provider>
  );
}

// ─── Raw Context Hook ─────────────────────────────────────────────────────────

/**
 * Returns the raw { state, dispatch } from PrintContext.
 * Use usePrintConfig() for a more ergonomic API.
 */
export function usePrintContext() {
  const ctx = useContext(PrintContext);
  if (!ctx) {
    throw new Error("usePrintContext must be used within a <PrintProvider>");
  }
  return ctx;
}

export { ACTIONS };
