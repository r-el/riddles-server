/**
 * Players Routes
 * Including authentication middleware where appropriate
 */
const express = require("express");
const playersController = require("../controllers/playersController");
const { optionalAuth, authenticate, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all players - admin only
router.get("/", authenticate(), authorize("admin"), playersController.getAllPlayers);

// Get leaderboard - requires user authentication
router.get("/leaderboard", authenticate(), playersController.getLeaderboard);

// Create a new player - admin only
router.post("/", authenticate(), authorize("admin"), playersController.createPlayer);

// Get player by username - optional authentication for enhanced data
router.get("/:username", optionalAuth(), playersController.getPlayerByUsername);

// Submit a score - requires user authentication
router.post("/submit-score", authenticate(), playersController.submitScore);

module.exports = router;
