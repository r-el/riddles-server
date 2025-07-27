/**
 * Authentication Service Unit Tests
 * Tests the core authentication functionality without database dependencies
 */
const bcrypt = require("bcrypt");
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
});
