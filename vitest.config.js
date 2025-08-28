/**
 * Vitest Configuration
 * Testing configuration for the riddles server
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./test/setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.js"],
      exclude: ["src/config/**", "src/db/**"],
    },
    testTimeout: 10000,
  },
});
