/**
 * Player Model
 * Supabase-based model for players
 */
const { supabase } = require("../db/supabase");
const { ApiError } = require("../middleware/errorHandler");

/**
 * @class Player
 * @classdesc Supabase-based model for players
 *
 * @param {Object} data - Player data
 * @param {number} data.id - Unique identifier for the player
 * @param {string} data.username - Player's username
 * @param {Date} data.created_at - Timestamp when the player was created
 * @param {number} [data.best_time=0] - Player's best time in milliseconds
 */
class Player {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.created_at = data.created_at;
    this.best_time = data.best_time || 0;
  }
}

module.exports = Player;
