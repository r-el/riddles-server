/**
 * Riddles Server - Main entry point
 * Starts the HTTP server and routes requests
 */
import express from "express";
import { serverConfig } from "./src/config/database.js";
import riddlesRouter from "./src/routes/riddlesRoutes.js";

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

// Riddles API routes
app.use("/riddles", riddlesRouter);

app.listen(port, host, () => {
  console.log(`Riddles Server running at http://${host}:${port}`);
});
