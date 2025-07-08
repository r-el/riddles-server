/**
 * Riddles Routes
 * Handles all /riddles API endpoints
 */
import express from "express";
import {
  getAllRiddlesController,
  addRiddleController,
  updateRiddleController,
  deleteRiddleController,
} from "../controllers/riddlesController.js";

const router = express.Router();

// GET /riddles
router.get("/", getAllRiddlesController);

// POST /riddles/addRiddle
router.post("/addRiddle", addRiddleController);

// PUT /riddles/updateRiddle
router.put("/updateRiddle", updateRiddleController);

// DELETE /riddles/deleteRiddle
router.delete("/deleteRiddle", deleteRiddleController);

export default router;
