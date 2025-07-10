/**
 * @class Player
 * @classdesc Represents a player in the game.
 *
 * @param {string} name - Name of the player
 * @param {number[]} [times=[]] - Array of time durations (in milliseconds) for each riddle solved
 * @param {number|null} [lowestTime=null] - The player's best total time across all riddles
 *
 * @property {number|undefined} id - Unique identifier (set by database)
 * @property {string} name - Player's name
 * @property {number[]} times - Array of time durations for each riddle solved
 * @property {number|null} lowestTime - Best total time for leaderboard
 */
export default class Player {
  /**
   * Creates a new Player instance.
   * @param {string} name - The name of the player
   * @param {number[]} [times=[]] - Array of time durations in milliseconds
   * @param {number|null} [lowestTime=null] - Best total time
   */
  constructor(name, times = [], lowestTime = null) {
    this.name = name;
    this.times = Array.isArray(times) ? times.filter(Number.isFinite) : [];
    this.lowestTime = lowestTime;
  }

  /**
   * Creates a Player instance from a plain object (for API responses)
   * @param {Object} obj - Object containing player data
   * @returns {Player} New Player instance
   */
  static fromObject(obj) {
    const player = new Player(obj.name, obj.times, obj.lowestTime);
    if (obj.id !== undefined) {
      player.id = obj.id;
    }
    return player;
  }
}
