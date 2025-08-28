/**
 * Authentication Service Unit Tests
 * Tests the core authentication functionality without database dependencies
 */
import { describe, test, expect, beforeEach, it, vi } from 'vitest';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authService from "../../src/services/authService.js";
import { ApiError } from "../../src/middleware/errorHandler.js";

// Mock dependencies
// Mock dependencies
vi.mock("bcrypt");
vi.mock("jsonwebtoken");
vi.mock("../../src/db/supabase.js", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    insert: vi.fn().mockReturnThis(),
  },
}));

describe("Authentication Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set required environment variables for tests
    process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-only";
    process.env.JWT_EXPIRES_IN = "1h";
    process.env.ADMIN_SECRET_CODE = "test-admin-code-123";
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
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, username: "testuser", role: "user" }, "test-jwt-secret-key-for-testing-only", {
        expiresIn: "1h",
      });
      expect(result).toBe(mockToken);
    });

    // Note: JWT_SECRET validation is now handled at config level, not runtime

    it("should throw error for invalid user object", () => {
      // Act & Assert
      expect(() => authService.generateToken({})).toThrow("User object must contain id, username, and role");
      expect(() => authService.generateToken({ id: 1 })).toThrow(
        "User object must contain id, username, and role"
      );
    });
  });

  describe("verifyToken", () => {
    it("should verify token successfully", () => {
      // Arrange
      const token = "valid.jwt.token";
      const decoded = { id: 1, username: "testuser", role: "user" };
      jwt.verify.mockReturnValue(decoded);

      // Act
      const result = authService.verifyToken(token);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, "test-jwt-secret-key-for-testing-only");
      expect(result).toEqual(decoded);
    });

    it("should throw ApiError for expired token", () => {
      // Arrange
      const error = new Error("Token expired");
      error.name = "TokenExpiredError";
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => authService.verifyToken("expired.token")).toThrow(ApiError);
      expect(() => authService.verifyToken("expired.token")).toThrow("Token has expired");
    });

    it("should throw ApiError for invalid token", () => {
      // Arrange
      const error = new Error("Invalid token");
      error.name = "JsonWebTokenError";
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => authService.verifyToken("invalid.token")).toThrow(ApiError);
      expect(() => authService.verifyToken("invalid.token")).toThrow("Invalid token");
    });

    // Note: JWT_SECRET validation is now handled at config level, not runtime

    it("should throw ApiError for invalid token format", () => {
      // Act & Assert
      expect(() => authService.verifyToken("")).toThrow(ApiError);
      expect(() => authService.verifyToken(123)).toThrow(ApiError);
    });
  });

  describe("isValidRole", () => {
    it("should return true for valid roles", () => {
      // Act & Assert
      expect(authService.isValidRole("guest")).toBe(true);
      expect(authService.isValidRole("user")).toBe(true);
      expect(authService.isValidRole("admin")).toBe(true);
    });

    it("should return false for invalid roles", () => {
      // Act & Assert
      expect(authService.isValidRole("invalid")).toBe(false);
      expect(authService.isValidRole("")).toBe(false);
    });
  });
});
