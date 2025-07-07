/**
 * Riddles Routes
 * Handles all /riddles API endpoints
 */
import { sendSuccess, sendError } from "../utils/responseHelper.js";
import {
  getAllRiddlesController,
  addRiddleController,
  updateRiddleController,
  deleteRiddleController,
} from "../controllers/riddlesController.js";

export function riddlesRoutes(req, res) {
  const { pathname } = req.parsedUrl;
  const method = req.method;

  // GET /riddles
  if (pathname === "/riddles" && method === "GET") {
    return getAllRiddlesController(req, res);
  }

  // POST /riddles/addRiddle
  if (pathname === "/riddles/addRiddle" && method === "POST") {
    return addRiddleController(req, res);
  }

  // PUT /riddles/updateRiddle
  if (pathname === "/riddles/updateRiddle" && method === "PUT") {
    return updateRiddleController(req, res);
  }

  // DELETE /riddles/deleteRiddle
  if (pathname === "/riddles/deleteRiddle" && method === "DELETE") {
    return deleteRiddleController(req, res);
  }

  // If no route matched
  sendError(res, 404, `Route ${pathname} not found`);
}
