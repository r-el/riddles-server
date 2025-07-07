/**
 * Riddles Routes
 * Handles all /riddles API endpoints
 */
import { sendSuccess, sendError } from "../utils/responseHelper.js";
import { getAllRiddles, addRiddle } from "../dal/riddlesDAL.js";

export function riddlesRoutes(req, res) {
  const { pathname } = req.parsedUrl;
  const method = req.method;

  // GET /riddles
  if (pathname === "/riddles" && method === "GET") {
    getAllRiddles()
      .then((riddles) => sendSuccess(res, riddles))
      .catch((err) => sendError(res, 500, "Failed to fetch riddles", err.message));
    return;
  }

  // POST /riddles/addRiddle
  if (pathname === "/riddles/addRiddle" && method === "POST") {
    const { name, taskDescription, correctAnswer } = req.body || {};
    if (!name || !taskDescription || !correctAnswer) {
      sendError(res, 400, "Missing name, taskDescription, or correctAnswer in request body");
      return;
    }
    addRiddle({ name, taskDescription, correctAnswer })
      .then((created) => sendSuccess(res, created, "Riddle added successfully"))
      .catch((err) => sendError(res, 500, "Failed to add riddle", err.message));
    return;
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
