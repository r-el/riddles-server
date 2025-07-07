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

/**
 * Update an existing riddle by id (async/Promise)
 * @param {string} id - The id of the riddle to update
 * @param {Object} updatedFields - The fields to update (name, taskDescription, correctAnswer)
 * @returns {Promise<Object>} The updated riddle
 */
export function updateRiddle(id, updatedFields) {
  return new Promise((resolve, reject) => {
    db.update(id, updatedFields, (err, updated) => {
      if (err) return reject(err);
      resolve(updated);
    });
  });
}

/**
 * Delete a riddle by id (async/Promise)
 * @param {string} id - The id of the riddle to delete
 * @returns {Promise<Object>} The deleted riddle (or info)
 */
export function deleteRiddle(id) {
  return new Promise((resolve, reject) => {
    db.delete(id, (err, deleted) => {
      if (err) return reject(err);
      resolve(deleted);
    });
  });
}
