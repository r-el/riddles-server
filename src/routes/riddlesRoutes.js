/**
 * Riddles Routes
 * Handles all /riddles API endpoints
 */
import { sendSuccess, sendError } from "../utils/responseHelper.js";
import { getAllRiddles, addRiddle, updateRiddle, deleteRiddle } from "../dal/riddlesDAL.js";
import { validateRiddleData, validateRiddleId } from "../utils/riddleValidator.js";

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
    const validationError = validateRiddleData(req.body);
    if (validationError) {
      sendError(res, 400, validationError);
      return;
    }
    const { name, taskDescription, correctAnswer } = req.body;
    addRiddle({ name, taskDescription, correctAnswer })
      .then((created) => sendSuccess(res, created, "Riddle added successfully"))
      .catch((err) => sendError(res, 500, "Failed to add riddle", err.message));
    return;
  }

  // PUT /riddles/updateRiddle
  if (pathname === "/riddles/updateRiddle" && method === "PUT") {
    const { id, name, taskDescription, correctAnswer } = req.body || {};
    const idError = validateRiddleId(id);
    if (idError) {
      sendError(res, 400, idError);
      return;
    }
    const dataError = validateRiddleData({ name, taskDescription, correctAnswer });
    if (dataError) {
      sendError(res, 400, dataError);
      return;
    }
    updateRiddle(id, { name, taskDescription, correctAnswer })
      .then((updated) => sendSuccess(res, updated, "Riddle updated successfully"))
      .catch((err) => sendError(res, 500, "Failed to update riddle", err.message));
    return;
  }

  // DELETE /riddles/deleteRiddle
  if (pathname === "/riddles/deleteRiddle" && method === "DELETE") {
    const { id } = req.body || {};
    const idError = validateRiddleId(id);
    if (idError) {
      sendError(res, 400, idError);
      return;
    }
    deleteRiddle(id)
      .then((deleted) => sendSuccess(res, deleted, "Riddle deleted successfully"))
      .catch((err) => sendError(res, 500, "Failed to delete riddle", err.message));
    return;
  }

  // If no route matched
  sendError(res, 404, `Route ${pathname} not found`);
}
