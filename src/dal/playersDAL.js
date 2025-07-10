/**
 * Players Data Access Layer (DAL)
 * Handles reading and writing players using json-file-crud
 */
import JsonFileCRUD from "json-file-crud";
import { databaseConfig } from "../config/database.js";

const db = new JsonFileCRUD(databaseConfig.playersFilePath, databaseConfig.options);

/**
 * Get all players from the database (async/Promise)
 * @returns {Promise<Array>} Array of players
 */
export function getAllPlayers() {
  return new Promise((resolve, reject) => {
    db.readAll((err, items) => {
      if (err) return reject(err);
      resolve(items);
    });
  });
}

/**
 * Add a new player to the database (async/Promise)
 * @param {Object} player - The player object to add (should have name, times, lowestTime)
 * @returns {Promise<Object>} The created player (with id)
 */
export function addPlayer(player) {
  return new Promise((resolve, reject) => {
    db.create(player, (err, created) => {
      if (err) return reject(err);
      resolve(created);
    });
  });
}

/**
 * Update an existing player by id (async/Promise)
 * @param {number} id - The id of the player to update
 * @param {Object} player - The fields to update (name, times, lowestTime)
 * @returns {Promise<Object>} The updated player
 */
export function updatePlayer(id, player) {
  return new Promise((resolve, reject) => {
    db.update(id, player, (err, updated) => {
      if (err) return reject(err);
      resolve(updated);
    });
  });
}

/**
 * Delete a player by id (async/Promise)
 * @param {number} id - The id of the player to delete
 * @returns {Promise<Object>} The deleted player (or info)
 */
export function deletePlayer(id) {
  return new Promise((resolve, reject) => {
    db.delete(id, (err, deleted) => {
      if (err) return reject(err);
      resolve(deleted);
    });
  });
}
