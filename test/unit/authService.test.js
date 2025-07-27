/**
 * Authentication Service Unit Tests
 * Tests the core authentication functionality without database dependencies
 */

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
