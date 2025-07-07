/**
 * Request Parser Middleware
 *
 * Adds to req:
 *   - req.parsedUrl: parsed URL info (pathname, search, searchParams, hash)
 *   - req.query: query string as an object
 *   - req.body: parsed JSON body (if present and valid)
 *
 * Usage: parseRequest(req, res, next)
 *
 * If the URL or JSON is invalid, sends 400 error automatically.
 */

import { sendError } from "../utils/responseHelper.js";

/**
 * Parses URL and JSON body (if needed) for Node.js HTTP requests.
 * @param {IncomingMessage} req - HTTP request object
 * @param {ServerResponse} res - HTTP response object
 * @param {Function} next - Callback to continue processing
 */
export function parseRequest(req, res, next) {
  // Parse URL and query
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    req.parsedUrl = {
      pathname: url.pathname,
      search: url.search,
      searchParams: url.searchParams,
      hash: url.hash,
    };
    req.query = {};
    url.searchParams.forEach((value, key) => {
      req.query[key] = value;
    });
  } catch {
    sendError(res, 400, "Invalid URL format");
    return;
  }

  // Parse body if needed
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      if (!body.trim()) {
        req.body = {};
        return next();
      }
      try {
        req.body = JSON.parse(body);
        next();
      } catch {
        sendError(res, 400, "Invalid JSON in request body");
      }
    });
    req.on("error", () => sendError(res, 400, "Error reading request body"));
  } else {
    req.body = {};
    next();
  }
}
