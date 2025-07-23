/**
 * Players Routes
 * Including authentication middleware where appropriate
 */
const express = require("express");
const playersController = require("../controllers/playersController");
const { optionalAuth } = require("../middleware/authMiddleware");
const router = express.Router();

// Get leaderboard - public access
router.get("/leaderboard", playersController.getLeaderboard);

// Create a new player - public access
router.post("/", playersController.createPlayer);

// Get player by username - optional authentication (better experience for authenticated users)
router.get("/:username", optionalAuth(), playersController.getPlayerByUsername);

// Submit a score - public access (anyone can play)
router.post("/submit-score", playersController.submitScore);

module.exports = router;
