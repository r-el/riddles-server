/**
 * Root Routes
 */
const express = require("express");
const router = express.Router();

// Root route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Riddles Server!",
    version: "2.0.0",
    features: {
      databases: "MongoDB for Riddles and Supabase (postgres) for Players",
      riddles: [
        "GET /riddles - Get all riddles",
        "GET /riddles/random - Get random riddle",
        "GET /riddles/:id - Get riddle by ID",
        "POST /riddles - Create new riddle",
        "PUT /riddles/:id - Update riddle",
        "DELETE /riddles/:id - Delete riddle",
        "POST /riddles/load-initial - Load initial riddles",
      ],
      players: [
        "GET /players/leaderboard - Get leaderboard",
        "POST /players - Create player",
        "GET /players/:username - Get player stats",
        "POST /players/submit-score - Submit score",
      ],
      system: ["GET /health - Health check"],
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
