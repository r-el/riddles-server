/**
 * Configuration Index
 * Central export point for all configuration modules
 */

export { databaseConfig, mongoConfig, supabaseConfig } from "./database.js";
export { serverConfig } from "./server.js";
export { authConfig } from "./auth.js";

// Import all configs as a single object
import { databaseConfig } from "./database.js";
import { serverConfig } from "./server.js";
import { authConfig } from "./auth.js";

export const config = {
  database: databaseConfig,
  server: serverConfig,
  auth: authConfig,
};

export default config;
