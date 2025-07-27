/**
 * Authentication Routes Integration Tests
 * Tests the complete authentication flow through HTTP endpoints
 */
const request = require("supertest");
const app = require("../../src/server");
const { ApiError } = require("../../src/middleware/errorHandler");

// Mock dependencies to avoid real database calls during testing
jest.mock("../../src/services/authService");
const authService = require("../../src/services/authService");

describe("Authentication Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const mockResult = {
        user: {
          id: 1,
          username: "testuser",
          role: "user",
          created_at: "2025-07-23T13:00:00.000Z",
        },
        token: "mock.jwt.token",
      };
      authService.registerUser.mockResolvedValue(mockResult);

      // Act
      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.data).toEqual(mockResult);
      expect(authService.registerUser).toHaveBeenCalledWith("testuser", "password123", undefined);
    });

    it("should register admin user with admin code", async () => {
      // Arrange
      const mockResult = {
        user: {
          id: 2,
          username: "adminuser",
          role: "admin",
          created_at: "2025-07-23T13:00:00.000Z",
        },
        token: "mock.admin.token",
      };
      authService.registerUser.mockResolvedValue(mockResult);

      // Act
      const response = await request(app).post("/auth/register").send({
        username: "adminuser",
        password: "password123",
        adminCode: "secret-admin-code",
      });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.user.role).toBe("admin");
      expect(authService.registerUser).toHaveBeenCalledWith("adminuser", "password123", "secret-admin-code");
    });

    it("should return 409 when username already exists", async () => {
      // Arrange
      authService.registerUser.mockRejectedValue(new ApiError(409, "Username already exists"));

      // Act
      const response = await request(app).post("/auth/register").send({
        username: "existinguser",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Username already exists");
    });

    it("should return 400 for invalid input", async () => {
      // Arrange
      const { ApiError } = require("../../src/middleware/errorHandler");
      authService.registerUser.mockRejectedValue(
        new ApiError(400, "Username must be at least 3 characters long")
      );

      // Act
      const response = await request(app).post("/auth/register").send({
        username: "ab",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Username must be at least 3 characters long");
    });

    it("should return 500 for internal server errors", async () => {
      // Arrange
      authService.registerUser.mockRejectedValue(new Error("Database connection failed"));

      // Act
      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Database connection failed");
    });
  });

  describe("POST /auth/login", () => {
    it("should login user successfully", async () => {
      // Arrange
      const mockResult = {
        user: {
          id: 1,
          username: "testuser",
          role: "user",
          created_at: "2025-07-23T13:00:00.000Z",
        },
        token: "mock.jwt.token",
      };
      authService.loginUser.mockResolvedValue(mockResult);

      // Act
      const response = await request(app).post("/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.data).toEqual(mockResult);
      expect(authService.loginUser).toHaveBeenCalledWith("testuser", "password123");
    });

    it("should return 401 for invalid credentials", async () => {
      // Arrange
      const { ApiError } = require("../../src/middleware/errorHandler");
      authService.loginUser.mockRejectedValue(new ApiError(401, "Invalid username or password"));

      // Act
      const response = await request(app).post("/auth/login").send({
        username: "wronguser",
        password: "wrongpassword",
      });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid username or password");
    });

    it("should return 400 for missing credentials", async () => {
      // Arrange
      const { ApiError } = require("../../src/middleware/errorHandler");
      authService.loginUser.mockRejectedValue(new ApiError(400, "Username and password are required"));

      // Act
      const response = await request(app).post("/auth/login").send({
        username: "testuser",
        // Missing password
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Username and password are required");
    });

    it("should return 500 for server errors during login", async () => {
      // Arrange
      authService.loginUser.mockRejectedValue(new Error("Database connection failed"));

      // Act
      const response = await request(app).post("/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Database connection failed");
    });
  });

  describe("GET /auth/profile", () => {
    it("should return user profile with valid token", async () => {
      // Arrange
      authService.verifyToken.mockReturnValue({
        id: 1,
        username: "testuser",
        role: "user",
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      authService.getUserById.mockResolvedValue({
        id: 1,
        username: "testuser",
        role: "user",
      });

      // Act
      const response = await request(app).get("/auth/profile").set("Authorization", "Bearer valid.token");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Profile retrieved successfully");
      expect(response.body.data.username).toBe("testuser");
    });

    it("should return 401 without token", async () => {
      // Act
      const response = await request(app).get("/auth/profile");

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Authentication token is required");
    });

    it("should return 401 with invalid token", async () => {
      // Arrange
      const { ApiError } = require("../../src/middleware/errorHandler");
      authService.verifyToken.mockImplementation(() => {
        throw new ApiError(401, "Invalid token");
      });

      // Act
      const response = await request(app).get("/auth/profile").set("Authorization", "Bearer invalid.token");

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid token");
    });

    it("should return 401 when user no longer exists", async () => {
      // Arrange
      authService.verifyToken.mockReturnValue({
        id: 999,
        username: "deleteduser",
        role: "user",
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      authService.getUserById.mockResolvedValue(null); // User deleted

      // Act
      const response = await request(app).get("/auth/profile").set("Authorization", "Bearer valid.token");

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("User not found or has been deleted");
    });
  });
});
