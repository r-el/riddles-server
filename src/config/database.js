/**
 * Database Configuration
 * Configuration settings for MongoDB and Supabase
 */

import { config } from "dotenv";

// Load environment variables from .env file
config();

/**
 * MongoDB configuration
 */
export const mongoConfig = {
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DB_NAME || "riddles_game",
  options: {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
  },
};

/**
 * Supabase configuration
 */
export const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
  options: {
    auth: {
      persistSession: false, // Disable session persistence for server-side usage
    },
  },
};

/**
 * Combined database configuration
 */
export const databaseConfig = {
  mongo: mongoConfig,
  supabase: supabaseConfig,
};

export default databaseConfig;
