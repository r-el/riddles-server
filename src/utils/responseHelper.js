/**
 * HTTP Response Helper Utilities
 * Provides standardized response functions for the server
 */

/**
 * Send JSON response with proper headers
 * @param {Object} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Data to send
 */
export function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Send success response
 * @param {Object} res - HTTP response object
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
 * @param {Object} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */
export function sendError(res, statusCode, message) {
  sendJSON(res, statusCode, {
    success: false,
    error: {
      message,
      statusCode,
    },
  });
}
