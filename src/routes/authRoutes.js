/**
 * Authentication Routes
 * Defines all routes related to user authentication and authorization
 */
const express = require("express");
const authController = require("../controllers/authController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Public authentication routes (no authentication required)
 */

// User registration
router.post("/register", authController.register);

module.exports = router;
