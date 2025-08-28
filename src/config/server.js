/**
 * Server Configuration
 * Configuration settings for the server
 */

import { config } from "dotenv";

// Load environment variables from .env file
config();

/**
 * Server configuration
 */
export const serverConfig = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  environment: process.env.NODE_ENV || "development",
};

export default serverConfig;
