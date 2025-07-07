/**
 * Riddles Data Access Layer (DAL)
 * Handles reading riddles from the JSON file using json-file-crud
 */
import JsonFileCRUD from "json-file-crud";
import { databaseConfig } from "../config/database.js";

const db = new JsonFileCRUD(databaseConfig.riddlesFilePath, databaseConfig.options);

/**
 * Get all riddles from the database (async/Promise)
 * @returns {Promise<Array>} Array of riddles
 */
export function getAllRiddles() {
  return new Promise((resolve, reject) => {
    db.readAll((err, items) => {
      if (err) return reject(err);
      resolve(items);
    });
  });
}
