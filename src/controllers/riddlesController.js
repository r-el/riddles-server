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

/**
 * Create a new riddle
 */
exports.createRiddle = catchAsync(async (req, res) => {
  const riddle = await Riddle.create(req.body);

  res.status(201).json({
    success: true,
    message: "Riddle created successfully",
    data: riddle,
  });
});

/**
 * Update a riddle
 */
exports.updateRiddle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const riddle = await Riddle.updateById(id, req.body);

  res.json({
    success: true,
    message: "Riddle updated successfully",
    data: riddle,
  });
});

/**
 * Delete a riddle
 */
exports.deleteRiddle = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Riddle.deleteById(id);

  res.json({
    success: true,
    message: "Riddle deleted successfully",
    data: { id },
  });
});

/**
 * Load initial riddles
 */
exports.loadInitialRiddles = catchAsync(async (req, res) => {
  const { riddles } = req.body;

  if (!riddles || !Array.isArray(riddles) || riddles.length === 0) {
    throw new ApiError(400, "No riddles provided or invalid format");
  }

  const result = await Riddle.loadInitial(riddles);

  res.status(201).json({
    success: true,
    message: `Successfully loaded ${result.inserted} riddles`,
    data: result,
  });
});
