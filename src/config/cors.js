/**
 * CORS Configuration
 * Configuration settings for Cross-Origin Resource Sharing
 */

import { config } from "dotenv";

// Load environment variables from .env file
config();

/**
 * CORS configuration
 */
export const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export default corsConfig;
