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

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

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
