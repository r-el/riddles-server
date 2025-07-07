/**
 * Riddles Routes
 * Handles all /riddles API endpoints (placeholders for now)
 *
 * Usage: riddlesRoutes(req, res)
 */
import { sendSuccess, sendError } from "../utils/responseHelper.js";

export function riddlesRoutes(req, res) {
  const { pathname } = req.parsedUrl;
  const method = req.method;

  // GET /riddles
  if (pathname === "/riddles" && method === "GET") {
    return sendSuccess(res, { message: "Get all riddles (placeholder)" });
  }

  // POST /riddles/addRiddle
  if (pathname === "/riddles/addRiddle" && method === "POST") {
    return sendSuccess(res, { message: "Add riddle (placeholder)", body: req.body });
  }

  // PUT /riddles/updateRiddle
  if (pathname === "/riddles/updateRiddle" && method === "PUT") {
    return sendSuccess(res, { message: "Update riddle (placeholder)", body: req.body });
  }

  // DELETE /riddles/deleteRiddle
  if (pathname === "/riddles/deleteRiddle" && method === "DELETE") {
    return sendSuccess(res, { message: "Delete riddle (placeholder)", body: req.body });
  }

  // If no route matched
  sendError(res, 404, `Route ${pathname} not found`);
}
