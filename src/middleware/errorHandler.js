/**
 * Error Handler Middleware
 * Sends a standardized error response for uncaught errors in the server.
 *
 * Usage: errorHandler(err, req, res, next)
 */

import { sendError } from "../utils/responseHelper.js";

/**
 * Express-style error handler for Node.js HTTP server
 * @param {Error} err - The error object
 * @param {IncomingMessage} req - HTTP request object
 * @param {ServerResponse} res - HTTP response object
 * @param {Function} next - Next middleware (not used here)
 */
export function errorHandler(err, req, res, next) {
  console.error("Server Error:", err);
  if (res.headersSent) {
    return next ? next(err) : undefined;
  }
  sendError(res, 500, "Internal Server Error");
}
