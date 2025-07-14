/**
 * Riddles Server - Main entry point
 * Starts the HTTP server and routes requests
 */
import express from "express";
import { serverConfig } from "./src/config/database.js";
import rootRouter from "./src/routes/rootRoutes.js";
import riddlesRouter from "./src/routes/riddlesRoutes.js";
import playersRouter from "./src/routes/playersRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const { port, host } = serverConfig;

const app = express();

// body parser middleware
app.use(express.json());

// Root routes
app.use("/", rootRouter);

// Riddles API routes
app.use("/riddles", riddlesRouter);

// Players API routes
app.use("/players", playersRouter);

// Error handler (should be after all routes)
app.use(errorHandler);

app.listen(port, host, () => {
  console.log(`Riddles Server running at http://${host}:${port}`);
});
