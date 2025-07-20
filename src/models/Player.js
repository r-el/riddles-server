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

  // Static Methods for Database Operations

  /**
   * Create a new player
   * 
   * @param {string} username - Player's username
   * @return {Promise<Player>} - Newly created Player instance
   * @throws {ApiError} - If player creation fails
   */
  static async create(username) {
    try {
      const { data, error } = await supabase.from("players").insert([{ username }]).select().single();

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          throw new ApiError(409, "Username already exists");
        }
        throw error;
      }

      return new Player(data);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to create player: " + error.message);
    }
  }

  /**
   * Find player by username
   */
  static async findByUsername(username) {
    try {
      const { data, error } = await supabase.from("players").select("*").eq("username", username).single();

      if (error) {
        if (error.code === "PGRST116") return null; // Record not found

        throw error;
      }

      return data ? new Player(data) : null;
    } catch (error) {
      throw new ApiError(500, "Failed to find player: " + error.message);
    }
  }

}

module.exports = Player;
