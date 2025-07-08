/**
 * HTTP Response Helper Utilities for Express
 * Provides standardized response functions for the server
 */

/**
 * Send JSON response with proper headers (Express style)
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Data to send
 */
export function sendJSON(res, statusCode, data) {
  res.status(statusCode).json(data);
}

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Success data
 * @param {string} message - Success message
 */
export function sendSuccess(res, data, message = "Success") {
  sendJSON(res, 200, {
    success: true,
    message,
    data,
  });
}

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} [details] - Optional error details
 */
export function sendError(res, statusCode, message, details) {
  sendJSON(res, statusCode, {
    success: false,
    error: {
      message,
      statusCode,
      ...(details ? { details } : {}),
    },
  });
}
