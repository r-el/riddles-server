import express from "express";
import {
  getAllPlayersController,
  getPlayerByIdController,
  addPlayerController,
  updatePlayerController,
  deletePlayerController,
} from "../controllers/playersController.js";

const router = express.Router();

// GET /players
router.get("/", getAllPlayersController);

// GET /players/:id
router.get("/:id", getPlayerByIdController);

// POST /players/addPlayer
router.post("/addPlayer", addPlayerController);

// PUT /players/updatePlayer
router.put("/updatePlayer", updatePlayerController);

// DELETE /players/:id
router.delete("/:id", deletePlayerController);

export default router;
