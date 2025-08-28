/**
 * Authentication Configuration
 * Configuration settings for JWT and authentication
 */

import { config } from "dotenv";

// Load environment variables from .env file
config();

/**
 * Authentication configuration
 */
export const authConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminSecretCode: process.env.ADMIN_SECRET_CODE,
  bcryptRounds: 10,
};

export default authConfig;
