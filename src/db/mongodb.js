/**
 * MongoDB Connection Module
 *
 * Manages connection to MongoDB Atlas for riddles storage
 */
import { MongoClient } from "mongodb";
import { mongoConfig } from "../config/database.js";

// Store client and collection as private variables
let client;
let riddlesCollection;
let connectionStatus = "disconnected";

// Connection options with pooling
const connectionOptions = mongoConfig.options;

/**
 * Creates connection to MongoDB with retry logic
 * @returns {Promise} - Promise that resolves when connection is established
 */
async function connectMongoDB(maxRetries = 3, retryDelay = 2000) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Attempting MongoDB connection... (attempt ${retries + 1}/${maxRetries})`);

      // Connection with pooling options
      client = await MongoClient.connect(mongoConfig.uri, connectionOptions);

      // Access database and collection
      const db = client.db(mongoConfig.dbName);
      riddlesCollection = db.collection("riddles");

      console.log("✔ MongoDB connection established successfully");
      console.log(
        `✔ Connection pool configured: min=${connectionOptions.minPoolSize}, max=${connectionOptions.maxPoolSize}`
      );
      connectionStatus = "connected";
      return client;
    } catch (error) {
      retries++;
      connectionStatus = "error";
      console.error(`✘ MongoDB connection attempt ${retries} failed:`, error.message);

      if (retries < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      } else {
        console.error("✘ All MongoDB connection attempts failed");
        throw error;
      }
    }
  }
}

/**
 * Returns access to riddles collection
 * @returns {Collection} - MongoDB collection object
 */
function getRiddlesCollection() {
  if (!riddlesCollection) {
    throw new Error("Database not connected. Call connectMongoDB first.");
  }
  return riddlesCollection;
}

/**
 * Get current MongoDB connection status
 */
function getMongoDBStatus() {
  return connectionStatus;
}

/**
 * Closes MongoDB connection
 */
async function closeMongoDB() {
  if (client) {
    await client.close();
    connectionStatus = "disconnected";
    console.log("MongoDB connection closed");
  }
}

export {
  connectMongoDB,
  getRiddlesCollection,
  getMongoDBStatus,
  closeMongoDB,
};
