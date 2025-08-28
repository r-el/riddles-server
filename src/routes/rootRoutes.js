/**
 * Root Routes
 */
import express from "express";
const router = express.Router();

// Root route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Riddles Server!",
    version: "3.3.0",
    features: {
      databases: "MongoDB for Riddles and Supabase (postgres) for Players",
      riddles: [
        "GET /riddles - Get all riddles (requires user/admin auth)",
        "GET /riddles/random - Get random riddle (public)",
        "GET /riddles/:id - Get riddle by ID (requires user/admin auth)",
        "POST /riddles - Create new riddle (requires user/admin auth)",
        "PUT /riddles/:id - Update riddle (requires admin auth)",
        "DELETE /riddles/:id - Delete riddle (requires admin auth)",
        "POST /riddles/load-initial - Load initial riddles (requires admin auth)",
      ],
      players: [
        "GET /players - Get all players (admin only)",
        "GET /players/leaderboard - Get leaderboard (requires user/admin auth)",
        "POST /players - Create player (admin only)",
        "GET /players/:username - Get player stats (requires auth, enhanced data for admin/own profile)",
        "POST /players/submit-score - Submit score (requires user auth)",
      ],
      auth: [
        "POST /auth/register - Register new user",
        "POST /auth/login - Login user",
        "GET /auth/profile - Get user profile (requires auth)",
        "POST /auth/validate - Validate token (requires auth)",
        "POST /auth/logout - Logout (requires auth)",
        "GET /auth/stats - Get auth stats (admin only)",
      ],
      system: ["GET /health - Health check"],
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
