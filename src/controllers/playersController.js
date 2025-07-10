import { getAllPlayers, addPlayer, updatePlayer, deletePlayer } from "../dal/playersDAL.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";
import Player from "../models/Player.js";

/**
 * Controller: Get all players
 * @route GET /players
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function getAllPlayersController(req, res) {
  try {
    const players = await getAllPlayers();
    sendSuccess(res, players);
  } catch (err) {
    sendError(res, 500, "Failed to fetch players", err.message);
  }
}

/**
 * Controller: Add a new player
 * @route POST /players/addPlayer
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function addPlayerController(req, res) {
  const { name, times, lowestTime } = req.body;

  if (!name || typeof name !== "string")
    return sendError(res, 400, "Player name is required and must be a string");

  try {
    const player = new Player(name, times, lowestTime);
    const created = await addPlayer(player);
    sendSuccess(res, created, "Player added successfully");
  } catch (err) {
    sendError(res, 500, "Failed to add player", err.message);
  }
}

/**
 * Controller: Update an existing player
 * @route PUT /players/updatePlayer
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function updatePlayerController(req, res) {
  const { id, name, times, lowestTime } = req.body || {};

  if (!id || typeof id !== "number") return sendError(res, 400, "Player ID is required and must be a number");

  if (!name || typeof name !== "string")
    return sendError(res, 400, "Player name is required and must be a string");

  try {
    const player = new Player(name, times, lowestTime);
    player.id = id; // Add the ID for update
    const updated = await updatePlayer(id, player);
    sendSuccess(res, updated, "Player updated successfully");
  } catch (err) {
    sendError(res, 500, "Failed to update player", err.message);
  }
}

/**
 * Controller: Delete a player by id
 * @route DELETE /players/:id
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function deletePlayerController(req, res) {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) return sendError(res, 400, "Valid player ID is required in URL parameters");

  try {
    const deleted = await deletePlayer(id);
    sendSuccess(res, deleted, "Player deleted successfully");
  } catch (err) {
    sendError(res, 500, "Failed to delete player", err.message);
  }
}

/**
 * Controller: Get a single player by ID
 * @route GET /players/:id
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function getPlayerByIdController(req, res) {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) return sendError(res, 400, "Valid player ID is required in URL parameters");

  try {
    const players = await getAllPlayers();
    const player = players.find((p) => p.id === id);

    if (!player) {
      sendError(res, 404, "Player not found");
      return;
    }

    sendSuccess(res, player);
  } catch (err) {
    sendError(res, 500, "Failed to fetch player", err.message);
  }
}
