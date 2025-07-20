/**
 * Express Application Setup
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Import middleware
const { globalErrorHandler } = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

// Create Express application
const app = express();

// Security middleware
app.use(helmet());
app.disable("x-powered-by");

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Basic middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logger
app.use(requestLogger);

// Routes
const rootRoutes = require("./routes/rootRoutes");
const riddlesRoutes = require("./routes/riddlesRoutes");
const playersRoutes = require("./routes/playersRoutes");

app.use("/", rootRoutes);
app.use("/riddles", riddlesRoutes);
app.use("/players", playersRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handler (must be last)
app.use(globalErrorHandler);

module.exports = app;
