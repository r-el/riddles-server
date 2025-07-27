/**
 * Authentication Routes Integration Tests
 * Tests the complete authentication flow through HTTP endpoints
 */
const request = require("supertest");
const app = require("../../src/server");

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

    it("should handle registration errors", async () => {
      // Arrange
      authService.registerUser.mockRejectedValue(new Error("Username already exists"));

      // Act
      const response = await request(app).post("/auth/register").send({
        username: "existinguser",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Username already exists");
    });
  });
});
