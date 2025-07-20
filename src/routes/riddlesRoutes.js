/**
 * Riddles Routes
 */
const express = require("express");
const riddlesController = require("../controllers/riddlesController");
const router = express.Router();

// Get all riddles
router.get("/", riddlesController.getAllRiddles);

// Get random riddle
router.get("/random", riddlesController.getRandomRiddle);

// Get riddle by ID
router.get("/:id", riddlesController.getRiddleById);

// Create a new riddle
router.post("/", riddlesController.createRiddle);

// Update a riddle
router.put("/:id", riddlesController.updateRiddle);

// Delete a riddle
router.delete("/:id", riddlesController.deleteRiddle);

// Load initial riddles
router.post("/load-initial", riddlesController.loadInitialRiddles);

module.exports = router;
