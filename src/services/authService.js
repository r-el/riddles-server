/**
 * Authentication Service
 * Handles user authentication, token generation and validation
 * Implements SOLID principles with single responsibility for auth operations
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../middleware/errorHandler");

// Configuration constants
const SALT_ROUNDS = 10;
const DEFAULT_TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Hash a password using bcrypt
 *
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} - Hashed password
 * @throws {Error} - If hashing fails
 */
async function hashPassword(password) {
  if (!password || typeof password !== "string") throw new Error("Password must be a non-empty string");

  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error("Failed to hash password: " + error.message);
  }
}

/**
 * Compare a password against a hash
 *
 * @param {string} password - Plain text password to check
 * @param {string} hash - Stored hash to compare against
 * @returns {Promise<boolean>} - True if password matches hash
 * @throws {Error} - If comparison fails
 */
async function comparePassword(password, hash) {
  if (!password || !hash) throw new Error("Password and hash are required");

  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error("Failed to compare password: " + error.message);
  }
}

/**
 * Generate a JWT token for a user
 *
 * @param {Object} user - User object
 * @param {number} user.id - User ID
 * @param {string} user.username - Username
 * @param {string} user.role - User role
 * @returns {string} - JWT token
 * @throws {Error} - If token generation fails
 */
function generateToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not configured in environment variables");

  if (!user || !user.id || !user.username || !user.role)
    throw new Error("User object must contain id, username, and role");

  try {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const expiresIn = DEFAULT_TOKEN_EXPIRATION;

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    throw new Error("Failed to generate token: " + error.message);
  }
}

/**
 * Verify and decode a JWT token
 *
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {ApiError} - If token is invalid or expired
 */
function verifyToken(token) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not configured in environment variables");

  if (!token || typeof token !== "string") throw new ApiError(401, "Invalid token format");

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token");
    } else {
      throw new ApiError(401, "Token verification failed");
    }
  }
}

/**
 * Validate user role
 *
 * @param {string} role - Role to validate
 * @returns {boolean} - True if role is valid
 */
function isValidRole(role) {
  const validRoles = ["guest", "user", "admin"];
  return validRoles.includes(role);
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  isValidRole,
};
