/**
 * Authentication Service
 * Handles user authentication, token generation and validation
 * Implements SOLID principles with single responsibility for auth operations
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../middleware/errorHandler.js";
import { supabase } from "../db/supabase.js";

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

/**
 * Register a new user
 *
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {string} [adminCode] - Optional admin code for admin registration
 * @returns {Promise<Object>} - User object with token
 * @throws {ApiError} - If registration fails
 */
async function registerUser(username, password, adminCode = null) {
  // Input validation
  if (!username || !password) throw new ApiError(400, "Username and password are required");

  if (username.length < 3) throw new ApiError(400, "Username must be at least 3 characters long");
  if (password.length < 6) throw new ApiError(400, "Password must be at least 6 characters long");

  try {
    // Check if username already exists
    const { data: existingUser, error: searchError } = await supabase
      .from("players")
      .select("id")
      .eq("username", username)
      .single();

    if (searchError && searchError.code !== "PGRST116")
      throw new ApiError(500, "Failed to check username availability");

    if (existingUser) throw new ApiError(409, "Username already exists");

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Determine role
    let role = "user";
    if (adminCode && adminCode === process.env.ADMIN_SECRET_CODE) {
      role = "admin";
    }

    // Create user in database
    const { data: newUser, error: createError } = await supabase
      .from("players")
      .insert([
        {
          username,
          password_hash: passwordHash,
          role,
        },
      ])
      .select("id, username, role, created_at")
      .single();

    if (createError) {
      if (createError.code === "23505") {
        throw new ApiError(409, "Username already exists");
      }
      throw new ApiError(500, "Failed to create user: " + createError.message);
    }

    // Generate token
    const token = generateToken(newUser);

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        created_at: newUser.created_at,
      },
      token,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Registration failed: " + error.message);
  }
}

/**
 * Login a user with username and password
 *
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} - User object with token
 * @throws {ApiError} - If login fails
 */
async function loginUser(username, password) {
  // Input validation
  if (!username || !password) throw new ApiError(400, "Username and password are required");

  try {
    // Find user by username
    const { data: user, error: userError } = await supabase
      .from("players")
      .select("id, username, password_hash, role, created_at")
      .eq("username", username)
      .single();

    if (userError) {
      if (userError.code === "PGRST116") {
        throw new ApiError(401, "Invalid username or password");
      }
      throw new ApiError(500, "Failed to find user: " + userError.message);
    }

    // Check if user has a password (not a legacy user)
    if (!user.password_hash)
      throw new ApiError(401, "User exists but has no password set. Please contact administrator.");

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid username or password");
    }

    // Generate token
    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
      },
      token,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Login failed: " + error.message);
  }
}

/**
 * Validate user exists and get user data by ID
 * Used by authentication middleware
 *
 * @param {number} userId - User ID from token
 * @returns {Promise<Object|null>} - User data or null if not found
 * @throws {ApiError} - If database error occurs
 */
async function getUserById(userId) {
  try {
    const { data: user, error } = await supabase
      .from("players")
      .select("id, username, role")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // User not found
      }
      throw new ApiError(500, "Failed to validate user: " + error.message);
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "User validation failed: " + error.message);
  }
}

export {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  isValidRole,
  registerUser,
  loginUser,
  getUserById,
};
