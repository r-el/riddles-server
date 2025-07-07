/**
 * Riddle Validator Utility
 * Provides validation functions for riddle data and id
 */

/**
 * Validate riddle data for add/update
 * @param {Object} data
 * @returns {string|null} Error message or null if valid
 */
export function validateRiddleData(data) {
  if (!data) return "Missing riddle data";
  const { name, taskDescription, correctAnswer } = data;
  if (!name || typeof name !== "string" || !name.trim()) return "Invalid or missing 'name'";
  if (!taskDescription || typeof taskDescription !== "string" || !taskDescription.trim()) return "Invalid or missing 'taskDescription'";
  if (!correctAnswer || typeof correctAnswer !== "string" || !correctAnswer.trim()) return "Invalid or missing 'correctAnswer'";
  return null;
}

/**
 * Validate riddle id for update/delete
 * @param {any} id
 * @returns {string|null} Error message or null if valid
 */
export function validateRiddleId(id) {
  if (id === undefined || id === null) return "Missing 'id'";
  if (typeof id !== "number" && typeof id !== "string") return "Invalid 'id' type";
  if (typeof id === "string" && !id.trim()) return "Empty 'id' string";
  return null;
}
