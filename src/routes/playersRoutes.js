/**
 * Players Routes
 */
const express = require("express");
const playersController = require("../controllers/playersController");
const router = express.Router();

// Get leaderboard
router.get("/leaderboard", playersController.getLeaderboard);

// Create a new player
router.post("/", playersController.createPlayer);

// Get player by username
router.get("/:username", playersController.getPlayerByUsername);

// Submit a score
router.post("/submit-score", playersController.submitScore);

module.exports = router;
