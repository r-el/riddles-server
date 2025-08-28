/**
 * Health Check Routes
 */
import express from "express";
const router = express.Router();

// Health check endpoint
router.get("/", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
