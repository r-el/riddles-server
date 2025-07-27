/**
 * Players Controller
 */
const Player = require("../models/Player");
const { catchAsync, ApiError } = require("../middleware/errorHandler");

/**
 * Create a new player
 */
exports.createPlayer = catchAsync(async (req, res) => {
  const { username } = req.body;

  if (!username) throw new ApiError(400, "Username is required");

  // Check if player already exists
  const existingPlayer = await Player.findByUsername(username);

  if (existingPlayer) {
    return res.json({
      success: true,
      message: "Player already exists",
      data: existingPlayer,
    });
  }

  // Create new player
  const player = await Player.create(username);

  res.status(201).json({
    success: true,
    message: "Player created successfully",
    data: player,
  });
});

/**
 * Get player by username
 */
exports.getPlayerByUsername = catchAsync(async (req, res) => {
  const { username } = req.params;
  const playerStats = await Player.getPlayerStats(username);

  res.json({
    success: true,
    data: playerStats,
  });
});

/**
 * Submit a score
 */
exports.submitScore = catchAsync(async (req, res) => {
  const { username, riddleId, timeToSolve } = req.body;

  if (!username || !riddleId || !timeToSolve)
    throw new ApiError(400, "Missing required fields: username, riddleId, timeToSolve");

  // Find or create player
  let player = await Player.findByUsername(username);

  if (!player) player = await Player.create(username);

  // Submit score
  await Player.submitScore(player.id, riddleId, timeToSolve);

  res.json({
    success: true,
    message: "Score submitted successfully",
  });
});

/**
 * Get leaderboard
 */
exports.getLeaderboard = catchAsync(async (req, res) => {
  const { limit = 10 } = req.query;
  const leaderboard = await Player.getLeaderboard(parseInt(limit));

  res.json({
    success: true,
    data: leaderboard,
  });
});

/**
 * Get all players (admin only)
 */
exports.getAllPlayers = catchAsync(async (req, res) => {
  const players = await Player.findAll();

  res.json({
    success: true,
    data: players,
  });
});

