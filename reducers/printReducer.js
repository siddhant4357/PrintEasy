/**
 * printReducer.js
 * Pure reducer managing all print configuration state transitions.
 *
 * State Shape:
 * {
 *   globalSettings: { copies: number, sides: "single" | "double" },
 *   files: Array<{
 *     id: string,
 *     name: string,
 *     originalPages: number,
 *     copies: number,       // effective value (may equal global if no override)
 *     sides: string,        // effective value (may equal global if no override)
 *     overrides: Set,       // Set of property keys explicitly overridden per-file
 *     duplexError: boolean, // true if this file fails the duplex validation
 *   }>,
 *   activeTab: "all" | "files",
 *   selectedFileId: string | null,
 * }
 */

import { isDuplexValid, DUPLEX_ERROR_MESSAGE } from "@/utils/printUtils";
import { INITIAL_FILES, DEFAULT_GLOBAL_SETTINGS } from "@/constants/initialData";

// ─── Initial State ────────────────────────────────────────────────────────────

export const initialState = {
  globalSettings: { ...DEFAULT_GLOBAL_SETTINGS },
  files: INITIAL_FILES.map((f) => ({
    ...f,
    copies: DEFAULT_GLOBAL_SETTINGS.copies,
    sides: DEFAULT_GLOBAL_SETTINGS.sides,
    overrides: new Set(),   // no per-file overrides initially
    duplexError: false,
  })),
  activeTab: "all",
  selectedFileId: INITIAL_FILES[0].id,
};

// ─── Action Types ─────────────────────────────────────────────────────────────

export const ACTIONS = {
  SET_GLOBAL_COPIES: "SET_GLOBAL_COPIES",
  SET_GLOBAL_SIDES: "SET_GLOBAL_SIDES",
  SET_FILE_COPIES: "SET_FILE_COPIES",
  SET_FILE_SIDES: "SET_FILE_SIDES",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  SET_SELECTED_FILE: "SET_SELECTED_FILE",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Computes the duplexError flag for a single file given its resolved values.
 */
function computeDuplexError(file, resolvedSides, resolvedCopies) {
  if (resolvedSides !== "double") return false;
  return !isDuplexValid(file.originalPages, resolvedCopies);
}

/**
 * Gets the effective copies for a file (override or global).
 */
function effectiveCopies(file, globalCopies) {
  return file.overrides.has("copies") ? file.copies : globalCopies;
}

/**
 * Gets the effective sides for a file (override or global).
 */
function effectiveSides(file, globalSides) {
  return file.overrides.has("sides") ? file.sides : globalSides;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function printReducer(state, action) {
  switch (action.type) {

    /**
     * SET_GLOBAL_COPIES
     * Update global copies value.
     * Rule 1: Only propagate to files that do NOT have a "copies" override.
     * Rule 2: Re-evaluate duplex errors for ALL files using their effective values.
     */
    case ACTIONS.SET_GLOBAL_COPIES: {
      const newGlobalCopies = Math.max(1, action.payload);
      const newGlobalSettings = { ...state.globalSettings, copies: newGlobalCopies };

      const updatedFiles = state.files.map((file) => {
        // Rule 1: If file has overridden copies, keep its own value
        const resolvedCopies = file.overrides.has("copies")
          ? file.copies
          : newGlobalCopies;

        const resolvedSides = effectiveSides(file, newGlobalSettings.sides);

        // Update copies on file only if NOT overridden
        const newFileCopies = file.overrides.has("copies")
          ? file.copies
          : newGlobalCopies;

        // Rule 2: Recalculate duplex error
        const duplexError = computeDuplexError(file, resolvedSides, resolvedCopies);

        return {
          ...file,
          copies: newFileCopies,
          duplexError,
        };
      });

      return {
        ...state,
        globalSettings: newGlobalSettings,
        files: updatedFiles,
      };
    }

    /**
     * SET_GLOBAL_SIDES
     * Update global sides value.
     * Rule 1: Only propagate to files that do NOT have a "sides" override.
     * Rule 2: Re-evaluate duplex errors for ALL files using their effective values.
     */
    case ACTIONS.SET_GLOBAL_SIDES: {
      const newGlobalSides = action.payload; // "single" | "double"
      const newGlobalSettings = { ...state.globalSettings, sides: newGlobalSides };

      const updatedFiles = state.files.map((file) => {
        const resolvedSides = file.overrides.has("sides")
          ? file.sides
          : newGlobalSides;

        const resolvedCopies = effectiveCopies(file, newGlobalSettings.copies);

        // Rule 1: Only update sides on file if NOT overridden
        const newFileSides = file.overrides.has("sides")
          ? file.sides
          : newGlobalSides;

        // Rule 2: Recalculate duplex error
        const duplexError = computeDuplexError(file, resolvedSides, resolvedCopies);

        return {
          ...file,
          sides: newFileSides,
          duplexError,
        };
      });

      return {
        ...state,
        globalSettings: newGlobalSettings,
        files: updatedFiles,
      };
    }

    /**
     * SET_FILE_COPIES
     * Set copies for a specific file only.
     * Rule 1: Marks "copies" as overridden for this file.
     * Rule 2: Re-evaluate duplex error for this file only.
     *
     * payload: { fileId: string, copies: number }
     */
    case ACTIONS.SET_FILE_COPIES: {
      const { fileId, copies } = action.payload;
      const newCopies = Math.max(1, copies);

      const updatedFiles = state.files.map((file) => {
        if (file.id !== fileId) return file;

        // Mark "copies" as overridden for this file
        const newOverrides = new Set(file.overrides);
        newOverrides.add("copies");

        // Effective sides for validation
        const resolvedSides = effectiveSides(file, state.globalSettings.sides);

        // Rule 2: Recalculate duplex error with new copies
        const duplexError = computeDuplexError(file, resolvedSides, newCopies);

        return {
          ...file,
          copies: newCopies,
          overrides: newOverrides,
          duplexError,
        };
      });

      return { ...state, files: updatedFiles };
    }

    /**
     * SET_FILE_SIDES
     * Set sides for a specific file only.
     * Rule 1: Marks "sides" as overridden for this file.
     * Rule 2: Re-evaluate duplex error for this file only.
     *
     * payload: { fileId: string, sides: "single" | "double" }
     */
    case ACTIONS.SET_FILE_SIDES: {
      const { fileId, sides } = action.payload;

      const updatedFiles = state.files.map((file) => {
        if (file.id !== fileId) return file;

        // Mark "sides" as overridden for this file
        const newOverrides = new Set(file.overrides);
        newOverrides.add("sides");

        // Effective copies for validation
        const resolvedCopies = effectiveCopies(file, state.globalSettings.copies);

        // Rule 2: Recalculate duplex error
        const duplexError = computeDuplexError(file, sides, resolvedCopies);

        return {
          ...file,
          sides,
          overrides: newOverrides,
          duplexError,
        };
      });

      return { ...state, files: updatedFiles };
    }

    /**
     * SET_ACTIVE_TAB
     * Switch between "all" and "files" tabs.
     * payload: "all" | "files"
     */
    case ACTIONS.SET_ACTIVE_TAB: {
      return { ...state, activeTab: action.payload };
    }

    /**
     * SET_SELECTED_FILE
     * Set which file is currently being configured in [Files] tab.
     * payload: string (fileId)
     */
    case ACTIONS.SET_SELECTED_FILE: {
      return { ...state, selectedFileId: action.payload };
    }

    default:
      return state;
  }
}
