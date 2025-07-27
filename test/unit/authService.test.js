/**
 * Authentication Service Unit Tests
 * Tests the core authentication functionality without database dependencies
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = require("../../src/services/authService");

// Mock dependencies
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../src/db/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    insert: jest.fn().mockReturnThis(),
  },
}));

describe("Authentication Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set required environment variables for tests
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
    process.env.ADMIN_SECRET_CODE = "admin123";
  });

  describe("hashPassword", () => {
    it("should hash password successfully", async () => {
      // Arrange
      const password = "testpassword123";
      const hashedPassword = "$2b$10$hashedversion";
      bcrypt.hash.mockResolvedValue(hashedPassword);

      // Act
      const result = await authService.hashPassword(password);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it("should throw error for empty password", async () => {
      await expect(authService.hashPassword("")).rejects.toThrow("Password must be a non-empty string");
    });

    it("should throw error for non-string password", async () => {
      // Act & Assert
      await expect(authService.hashPassword(123)).rejects.toThrow("Password must be a non-empty string");
    });

    it("should handle bcrypt errors", async () => {
      // Arrange
      bcrypt.hash.mockRejectedValue(new Error("Bcrypt error"));

      // Act & Assert
      await expect(authService.hashPassword("password")).rejects.toThrow(
        "Failed to hash password: Bcrypt error"
      );
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching passwords", async () => {
      // Arrange
      const password = "testpassword";
      const hash = "$2b$10$hashedversion";
      bcrypt.compare.mockResolvedValue(true);

      // Act
      const result = await authService.comparePassword(password, hash);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it("should return false for non-matching passwords", async () => {
      // Arrange
      bcrypt.compare.mockResolvedValue(false);

      // Act
      const result = await authService.comparePassword("wrong", "hash");

      // Assert
      expect(result).toBe(false);
    });

    it("should throw error for missing parameters", async () => {
      // Act & Assert
      await expect(authService.comparePassword("", "hash")).rejects.toThrow("Password and hash are required");
      await expect(authService.comparePassword("password", "")).rejects.toThrow(
        "Password and hash are required"
      );
    });
  });

  describe("generateToken", () => {
    it("should generate token successfully", () => {
      // Arrange
      const user = { id: 1, username: "testuser", role: "user" };
      const mockToken = "mock.jwt.token";
      jwt.sign.mockReturnValue(mockToken);

      // Act
      const result = authService.generateToken(user);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, username: "testuser", role: "user" }, "test-secret", {
        expiresIn: "1h",
      });
      expect(result).toBe(mockToken);
    });

    it("should throw error for missing JWT_SECRET", () => {
      // Arrange
      delete process.env.JWT_SECRET;
      const user = { id: 1, username: "testuser", role: "user" };

      // Act & Assert
      expect(() => authService.generateToken(user)).toThrow("JWT_SECRET not configured");
    });

    it("should throw error for invalid user object", () => {
      // Act & Assert
      expect(() => authService.generateToken({})).toThrow("User object must contain id, username, and role");
      expect(() => authService.generateToken({ id: 1 })).toThrow(
        "User object must contain id, username, and role"
      );
    });
  });
});
