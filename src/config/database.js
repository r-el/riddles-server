/**
 * Database Configuration
 * Configuration settings for the riddles database
 */

import path from "path";
import { fileURLToPath } from "url";

// Get current directory (ES modules equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database configuration
 */
export const databaseConfig = {
  // Path to the riddles JSON file
  riddlesFilePath: path.join(__dirname, "../../data/riddles.json"),

  // json-file-crud options
  options: {
    idField: "id",
    uniqueFields: [],
    autoId: true,
  },
};

/**
 * Server configuration
 */
export const serverConfig = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
};
