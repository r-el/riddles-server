/**
 * Riddle Model
 * MongoDB-based model for riddles
 */
const { ObjectId } = require("mongodb");
const { getRiddlesCollection } = require("../db/mongodb");
const { ApiError } = require("../middleware/errorHandler");

/**
 * Creates a new Riddle instance.
 * @param {Object} params
 * @param {number} [params.id] - The unique identifier for the riddle.
 * @param {string} params.name - The name or title of the riddle.
 * @param {string} params.taskDescription - The text describing the riddle.
 * @param {string} params.correctAnswer - The correct answer to the riddle.
 */
class Riddle {
  constructor(data) {
    this.question = data.question;
    this.answer = data.answer;
    this.level = data.level || "medium";
    this.createdAt = data.createdAt || new Date();
  }

  /**
   * Convert to MongoDB document
   */
  toDocument() {
    return {
      question: this.question,
      answer: this.answer,
      level: this.level,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Riddle;
