/**
 * Authentication Routes Integration Tests
 * Tests the complete authentication flow through HTTP endpoints
 */
const request = require('supertest');
const app = require('../../src/server');

// Mock dependencies to avoid real database calls during testing
jest.mock('../../src/services/authService');
const authService = require('../../src/services/authService');

describe('Authentication Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const mockResult = {
        user: {
          id: 1,
          username: 'testuser',
          role: 'user',
          created_at: '2025-07-23T13:00:00.000Z'
        },
        token: 'mock.jwt.token'
      };
      authService.registerUser.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toEqual(mockResult);
      expect(authService.registerUser).toHaveBeenCalledWith('testuser', 'password123', undefined);
    });
  });
});
