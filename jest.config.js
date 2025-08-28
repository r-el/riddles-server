/**
 * Jest Configuration
 * Testing configuration for the riddles server
 */
export default {
  preset: "jest",
  testEnvironment: "node",
  verbose: true, // Show individual test results
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!src/config/**", "!src/db/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  testTimeout: 10000,
  transform: {},
  extensionsToTreatAsEsm: [".js"],
  moduleNameMapping: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
