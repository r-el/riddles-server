// Riddle model - represents a single riddle object
/**
 * Creates a new Riddle instance.
 * @param {Object} params
 * @param {number} [params.id] - The unique identifier for the riddle.
 * @param {string} params.name - The name or title of the riddle.
 * @param {string} params.taskDescription - The text describing the riddle.
 * @param {string} params.correctAnswer - The correct answer to the riddle.
 */
export class Riddle {
  constructor({ id, name, taskDescription, correctAnswer }) {
    this.id = id;
    this.name = name;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer;
  }
}
