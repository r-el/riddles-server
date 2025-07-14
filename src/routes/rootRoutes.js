import express from "express";

const router = express.Router();

// Root route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Riddles Server!",
    endpoints: [
      "GET /riddles",
      "POST /riddles/addRiddle",
      "PUT /riddles/updateRiddle",
      "DELETE /riddles/deleteRiddle",
      "GET /players",
      "GET /players/:id",
      "POST /players/addPlayer", 
      "PUT /players/updatePlayer",
      "DELETE /players/:id",
    ],
  });
});

export default router;
