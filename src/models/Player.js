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
   * @param {string} username - Player's username
   * @return {Promise<Player|null>} - Player instance or null if not found
   * @throws {ApiError} - If player lookup fails
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

  /**
   * Get all players
   *
   * @param {number} [limit=50] - Maximum number of players to return
   * @param {number} [offset=0] - Offset for pagination
   * @returns {Promise<Array<Player>>} - Array of Player instances
   * @throws {ApiError} - If player retrieval fails
   */
  static async findAll(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("best_time", { ascending: true, nullsFirst: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return data.map((row) => new Player(row));
    } catch (error) {
      throw new ApiError(500, "Failed to get players: " + error.message);
    }
  }

  /**
   * Get player by ID
   * @param {number} id - Player's ID
   * @return {Promise<Player|null>} - Player instance or null if not found
   * @throws {ApiError} - If player lookup fails
   */
  static async findById(id) {
    try {
      const { data, error } = await supabase.from("players").select("*").eq("id", id).single();

      if (error) {
        if (error.code === "PGRST116") throw new ApiError(404, "Player not found"); // Record not found

        throw error;
      }

      return new Player(data);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to find player: " + error.message);
    }
  }
}

module.exports = Player;
