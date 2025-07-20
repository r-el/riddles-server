/**
 * Riddles Controller
 */
const Riddle = require("../models/Riddle");
const { catchAsync, ApiError } = require("../middleware/errorHandler");

/**
 * Get all riddles
 */
exports.getAllRiddles = catchAsync(async (req, res) => {
  const { level, limit = 50, skip = 0 } = req.query;
  const filters = {};

  if (level) filters.level = level;

  const riddles = await Riddle.findAll(filters, { limit: parseInt(limit), skip: parseInt(skip) });

  res.json({
    success: true,
    count: riddles.length,
    data: riddles,
  });
});

/**
 * Get riddle by ID
 */
exports.getRiddleById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const riddle = await Riddle.findById(id);

  if (!riddle) {
    throw new ApiError(404, "Riddle not found");
  }

  res.json({
    success: true,
    data: riddle,
  });
});

