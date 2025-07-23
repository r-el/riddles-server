/**
 * Authentication Middleware
 * Handles user authentication and authorization for protected routes
 */
const { ApiError } = require("./errorHandler");
const { verifyToken, getUserById } = require("../services/authService");

/**
 * Extract token from request headers or query parameters
 *
 * @param {Object} req - Express request object
 * @returns {string|null} - Extracted token or null if not found
 */
function extractToken(req) {
  // Check Authorization header (Bearer token format)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // Check query param (for convenience in testing, not recommended for production)
  if (req.query && req.query.token) {
    return req.query.token;
  }

  // Check custom header
  if (req.headers["x-auth-token"]) {
    return req.headers["x-auth-token"];
  }

  return null;
}

/**
 * Authentication middleware factory
 * Creates middleware that optionally or mandatorily authenticates users
 *
 * @param {Object} options - Authentication options
 * @param {boolean} [options.required=true] - Whether authentication is required
 * @param {boolean} [options.allowGuest=false] - Whether to allow guest access
 * @returns {Function} - Express middleware function
 */
function authenticate(options = {}) {
  const { required = true, allowGuest = false } = options;

  return async (req, res, next) => {
    try {
      // Extract token from request
      const token = extractToken(req);

      // Handle case when no token is provided
      if (!token) {
        if (required) {
          return next(new ApiError(401, "Authentication token is required"));
        } else {
          // Set guest user for optional authentication
          req.user = { role: "guest" };
          return next();
        }
      }

      // Verify and decode token
      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (error) {
        return next(error); // This will be an ApiError from verifyToken
      }

      // Validate that user still exists and has same role
      const user = await getUserById(decoded.id);
      if (!user) {
        return next(new ApiError(401, "User not found or has been deleted"));
      }

      // Check if user role has changed since token was issued
      if (user.role !== decoded.role) {
        return next(new ApiError(401, "User role has changed. Please login again"));
      }

      // Add user information to request object
      req.user = user;
      req.tokenData = decoded; // Include original token data if needed

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      }
      next(new ApiError(500, "Authentication failed: " + error.message));
    }
  };
}

/**
 * Authorization middleware factory
 * Creates middleware that checks if authenticated user has required role(s)
 *
 * @param {...string} allowedRoles - Roles that are allowed to access the resource
 * @returns {Function} - Express middleware function
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return next(new ApiError(401, "Authentication required for authorization"));
    }

    // If no roles specified, allow any authenticated user
    if (allowedRoles.length === 0) {
      return next();
    }

    // Check if user's role is in the allowed roles
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // User doesn't have required role
    const message = `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}`;
    next(new ApiError(403, message));
  };
}

/**
 * Middleware that requires user or admin role
 *
 * @returns {Function} - Express middleware function
 */
function requireUserOrAdmin() {
  return authorize("user", "admin");
}

module.exports = {
  authenticate,
  authorize,
  requireUserOrAdmin,
  extractToken,
};
