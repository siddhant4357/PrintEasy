/**
 * initialData.js
 * Static seed data for the print configuration interface.
 * This is the single source of truth for file initialization.
 */

export const INITIAL_FILES = [
  { id: "file-a", name: "File A", originalPages: 1 },
  { id: "file-b", name: "File B", originalPages: 3 },
  { id: "file-c", name: "File C", originalPages: 1 },
];

export const DEFAULT_GLOBAL_SETTINGS = {
  copies: 1,
  sides: "single", // "single" | "double"
};
