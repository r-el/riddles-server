/**
 * Riddles Data Access Layer (DAL)
 * Handles reading and writing riddles using json-file-crud
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

/**
 * Add a new riddle to the database (async/Promise)
 * @param {Object} riddle - The riddle object to add (should have question & answer)
 * @returns {Promise<Object>} The created riddle (with id)
 */
export function addRiddle(riddle) {
  return new Promise((resolve, reject) => {
    db.create(riddle, (err, created) => {
      if (err) return reject(err);
      resolve(created);
    });
  });
}
