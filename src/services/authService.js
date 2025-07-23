/**
 * Authentication Service
 * Handles user authentication, token generation and validation
 * Implements SOLID principles with single responsibility for auth operations
 */
const bcrypt = require("bcrypt");

// Configuration constants
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 *
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} - Hashed password
 * @throws {Error} - If hashing fails
 */
async function hashPassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error("Failed to hash password: " + error.message);
  }
}

module.exports = {
  hashPassword,
};
