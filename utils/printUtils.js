/**
 * printUtils.js
 * Pure utility functions for print configuration validation logic.
 */

/**
 * Checks if double-sided printing is valid for a given file.
 * Rule: (originalPages × copies) >= 2
 *
 * @param {number} originalPages - Number of pages in the file
 * @param {number} copies - Number of copies selected
 * @returns {boolean} true if double-sided is permitted
 */
export function isDuplexValid(originalPages, copies) {
  return originalPages * copies >= 2;
}

/**
 * Returns the duplex validation error message string.
 * Kept in one place so it's easy to update.
 */
export const DUPLEX_ERROR_MESSAGE =
  "Insufficient pages. Add more pages or increase copies to enable Double Sided printing.";

/**
 * Resolves the effective value of a property for a file.
 * If the file has a local override for this property, use file's value.
 * Otherwise fall back to the global value.
 *
 * @param {Object} file - The file object
 * @param {string} property - The property key ("copies" | "sides")
 * @param {Object} globalSettings - The global settings object
 * @returns {*} The resolved value
 */
export function resolveFileValue(file, property, globalSettings) {
  if (file.overrides.has(property)) {
    return file[property];
  }
  return globalSettings[property];
}
