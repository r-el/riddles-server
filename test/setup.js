/**
 * Global Test Setup
 * Configuration and environment setup for all tests
 */

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-only";
process.env.JWT_EXPIRES_IN = "1h";
process.env.ADMIN_SECRET_CODE = "test-admin-code-123";

// Disable console logs during testing (optional)
if (process.env.SILENT_TESTS === "true") {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}

// Global test timeout
jest.setTimeout(10000);

// Mock console for specific tests if needed
global.mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
