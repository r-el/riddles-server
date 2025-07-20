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

  /**
   * Get all riddles
   *
   * @param {Object} filters - MongoDB query filters
   * @param {Object} options - Pagination and sorting options
   * @param {number} [options.limit=50] - Number of riddles to return
   * @param {number} [options.skip=0] - Number of riddles to skip
   * @param {Object} [options.sort={ createdAt: -1 }] - Sorting options
   * @returns {Promise<Array>} - Array of riddle documents
   * @throws {ApiError} - If no riddles found or invalid parameters
   */
  static async findAll(filters = {}, options = {}) {
    const collection = getRiddlesCollection();
    const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;

    return await collection.find(filters).sort(sort).skip(skip).limit(limit).toArray();
  }

  /**
   * Get random riddle
   */
  static async findRandom() {
    const collection = getRiddlesCollection();
    const count = await collection.countDocuments();

    if (count === 0) throw new ApiError(404, "No riddles found in database");

    const random = Math.floor(Math.random() * count);
    const riddle = await collection.find().limit(1).skip(random).toArray();
    return riddle[0];
  }

  /**
   * Update riddle by ID
   */
  static async updateById(id, updateData) {
    const collection = getRiddlesCollection();

    if (!ObjectId.isValid(id)) throw new ApiError(400, "Invalid riddle ID format");

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) throw new ApiError(404, "Riddle not found");

    return await this.findById(id);
  }

  /**
   * Delete riddle by ID
   */
  static async deleteById(id) {
    const collection = getRiddlesCollection();

    if (!ObjectId.isValid(id)) throw new ApiError(400, "Invalid riddle ID format");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) throw new ApiError(404, "Riddle not found");

    return { deletedId: id };
  }


}

module.exports = Riddle;
