/**
 * Riddles Server - Main entry point
 * Starts the HTTP server and routes requests
 */
import express from "express";
import { serverConfig } from "./src/config/database.js";

const { port, host } = serverConfig;

const app = express();

// body parser middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Riddles Server!",
    endpoints: [
      "GET /riddles",
      "POST /riddles/addRiddle",
      "PUT /riddles/updateRiddle",
      "DELETE /riddles/deleteRiddle",
    ],
  });
});

// The rest of the routes will be migrated in the next steps

app.listen(port, host, () => {
  console.log(`Riddles Server running at http://${host}:${port}`);
});
