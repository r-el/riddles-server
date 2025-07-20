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

  // Static Methods for Database Operations

  /**
   * Create a new riddle
   */
  static async create(data) {
    const collection = getRiddlesCollection();
    const riddle = new Riddle(data);
    const result = await collection.insertOne(riddle.toDocument());
    return { _id: result.insertedId, ...riddle.toDocument() };
  }

  /**
   * Find riddle by ID
   */
  static async findById(id) {
    const collection = getRiddlesCollection();

    if (!ObjectId.isValid(id)) throw new ApiError(400, "Invalid riddle ID format");

    return await collection.findOne({ _id: new ObjectId(id) });
  }

}

module.exports = Riddle;
