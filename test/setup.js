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
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}
