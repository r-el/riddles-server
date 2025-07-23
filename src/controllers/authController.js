/**
 * Authentication Controller
 * Handles HTTP requests for user authentication and authorization
 * Implements clean API design with proper error handling
 */
const { catchAsync, ApiError } = require("../middleware/errorHandler");
const authService = require("../services/authService");

/**
 * Register a new user
 *
 * @route POST /auth/register
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - Username (3+ characters)
 * @param {string} req.body.password - Password (6+ characters)
 * @param {string} [req.body.adminCode] - Optional admin secret code
 */
exports.register = catchAsync(async (req, res) => {
  const { username, password, adminCode } = req.body;

  // Register user through auth service
  const result = await authService.registerUser(username, password, adminCode);

  // Log successful registration (without sensitive data)
  console.log(`New user registered: ${username} with role: ${result.user.role}`);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

/**
 * Login user with username and password
 *
 * @route POST /auth/login
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - Username
 * @param {string} req.body.password - Password
 */
exports.login = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  // Login user through auth service
  const result = await authService.loginUser(username, password);

  // Log successful login (without sensitive data)
  console.log(`User logged in: ${username} with role: ${result.user.role}`);

  res.json({
    success: true,
    message: "Login successful",
    data: result,
  });
});
