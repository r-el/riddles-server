import { getAllRiddles, addRiddle, updateRiddle, deleteRiddle } from "../dal/riddlesDAL.js";
import { validateRiddleData, validateRiddleId } from "../utils/riddleValidator.js";
import { Riddle } from "../models/Riddle.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";

/**
 * Controller: Get all riddles
 * @route GET /riddles
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export async function getAllRiddlesController(req, res) {
  try {
    const riddles = await getAllRiddles();
    sendSuccess(res, riddles);
  } catch (err) {
    sendError(res, 500, "Failed to fetch riddles", err.message);
  }
}

/**
 * Controller: Add a new riddle
 * @route POST /riddles/addRiddle
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export async function addRiddleController(req, res) {
  const validationError = validateRiddleData(req.body);
  if (validationError) {
    sendError(res, 400, validationError);
    return;
  }
  try {
    const riddle = new Riddle(req.body);
    const created = await addRiddle(riddle);
    sendSuccess(res, created, "Riddle added successfully");
  } catch (err) {
    sendError(res, 500, "Failed to add riddle", err.message);
  }
}

/**
 * Controller: Update an existing riddle
 * @route PUT /riddles/updateRiddle
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export async function updateRiddleController(req, res) {
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
  try {
    const riddle = new Riddle({ id, name, taskDescription, correctAnswer });
    const updated = await updateRiddle(id, riddle);
    sendSuccess(res, updated, "Riddle updated successfully");
  } catch (err) {
    sendError(res, 500, "Failed to update riddle", err.message);
  }
}

/**
 * Controller: Delete a riddle by id
 * @route DELETE /riddles/deleteRiddle
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export async function deleteRiddleController(req, res) {
  const { id } = req.body || {};
  const idError = validateRiddleId(id);
  if (idError) {
    sendError(res, 400, idError);
    return;
  }
  try {
    const deleted = await deleteRiddle(id);
    sendSuccess(res, deleted, "Riddle deleted successfully");
  } catch (err) {
    sendError(res, 500, "Failed to delete riddle", err.message);
  }
}
