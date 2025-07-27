/**
 * Protected Routes Integration Tests
 * Tests route protection for riddles and players endpoints
 */
const request = require("supertest");
const app = require("../../src/server");

// Mock dependencies
jest.mock("../../src/services/authService");
jest.mock("../../src/models/Riddle");
jest.mock("../../src/models/Player");

const authService = require("../../src/services/authService");
const Riddle = require("../../src/models/Riddle");
const Player = require("../../src/models/Player");

describe("Protected Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Riddles Routes Protection", () => {
    const mockRiddles = [{ _id: "1", question: "Test question", answer: "Test answer", level: "easy" }];

    describe("GET /riddles", () => {
      it("should allow access with valid user token", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 1,
          username: "testuser",
          role: "user",
        });
        authService.getUserById.mockResolvedValue({
          id: 1,
          username: "testuser",
          role: "user",
        });
        Riddle.findAll.mockResolvedValue(mockRiddles);

        // Act
        const response = await request(app).get("/riddles").set("Authorization", "Bearer valid.user.token");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      it("should allow access with valid admin token", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 2,
          username: "admin",
          role: "admin",
        });
        authService.getUserById.mockResolvedValue({
          id: 2,
          username: "admin",
          role: "admin",
        });
        Riddle.findAll.mockResolvedValue(mockRiddles);

        // Act
        const response = await request(app).get("/riddles").set("Authorization", "Bearer valid.admin.token");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      it("should deny access without token", async () => {
        // Act
        const response = await request(app).get("/riddles");

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Authentication token is required");
      });
    });

    describe("GET /riddles/random", () => {
      it("should allow public access", async () => {
        // Arrange
        const mockRandomRiddle = { _id: "1", question: "Random question", answer: "Random answer" };
        Riddle.findRandom.mockResolvedValue(mockRandomRiddle);

        // Act
        const response = await request(app).get("/riddles/random");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockRandomRiddle);
      });
    });

    describe("POST /riddles", () => {
      const newRiddle = {
        question: "New question",
        answer: "New answer",
        level: "medium",
      };

      it("should allow user to create riddle", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 1,
          username: "testuser",
          role: "user",
        });
        authService.getUserById.mockResolvedValue({
          id: 1,
          username: "testuser",
          role: "user",
        });
        const mockCreatedRiddle = { _id: "2", ...newRiddle };
        Riddle.create.mockResolvedValue(mockCreatedRiddle);

        // Act
        const response = await request(app)
          .post("/riddles")
          .set("Authorization", "Bearer valid.user.token")
          .send(newRiddle);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      it("should deny access without authentication", async () => {
        // Act
        const response = await request(app).post("/riddles").send(newRiddle);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
      });
    });

    describe("DELETE /riddles/:id", () => {
      it("should allow admin to delete riddle", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 2,
          username: "admin",
          role: "admin",
        });
        authService.getUserById.mockResolvedValue({
          id: 2,
          username: "admin",
          role: "admin",
        });
        Riddle.deleteById.mockResolvedValue({ deletedId: "1" });

        // Act
        const response = await request(app)
          .delete("/riddles/1")
          .set("Authorization", "Bearer valid.admin.token");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      it("should deny user access to delete riddle", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 1,
          username: "testuser",
          role: "user",
        });
        authService.getUserById.mockResolvedValue({
          id: 1,
          username: "testuser",
          role: "user",
        });

        // Act
        const response = await request(app)
          .delete("/riddles/1")
          .set("Authorization", "Bearer valid.user.token");

        // Assert
        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain("Access denied");
      });

      it("should deny access without authentication", async () => {
        // Act
        const response = await request(app).delete("/riddles/1");

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Authentication token is required");
      });
    });
  });

  describe("Players Routes Protection", () => {
    const mockPlayers = [{ _id: "1", username: "testuser", email: "test@example.com" }];

    describe("GET /players", () => {
      it("should allow admin to access players list", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 2,
          username: "admin",
          role: "admin",
        });
        authService.getUserById.mockResolvedValue({
          id: 2,
          username: "admin",
          role: "admin",
        });
        Player.findAll.mockResolvedValue(mockPlayers);

        // Act
        const response = await request(app).get("/players").set("Authorization", "Bearer valid.admin.token");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      it("should deny user access to players list", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 1,
          username: "testuser",
          role: "user",
        });
        authService.getUserById.mockResolvedValue({
          id: 1,
          username: "testuser",
          role: "user",
        });

        // Act
        const response = await request(app).get("/players").set("Authorization", "Bearer valid.user.token");

        // Assert
        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain("Access denied");
      });

      it("should deny access without authentication", async () => {
        // Act
        const response = await request(app).get("/players");

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Authentication token is required");
      });
    });

    describe("GET /players/leaderboard", () => {
      it("should allow user to access leaderboard", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 1,
          username: "testuser",
          role: "user",
        });
        authService.getUserById.mockResolvedValue({
          id: 1,
          username: "testuser",
          role: "user",
        });
        const mockLeaderboard = [{ username: "player1", score: 100 }];
        Player.getLeaderboard.mockResolvedValue(mockLeaderboard);

        // Act
        const response = await request(app).get("/players/leaderboard").set("Authorization", "Bearer valid.user.token");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      it("should deny access without authentication", async () => {
        // Act
        const response = await request(app).get("/players/leaderboard");

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Authentication token is required");
      });
    });

    describe("POST /players", () => {
      it("should allow admin to create player", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 2,
          username: "admin",
          role: "admin",
        });
        authService.getUserById.mockResolvedValue({
          id: 2,
          username: "admin",
          role: "admin",
        });
        const mockPlayer = { id: "123", username: "newplayer", email: "new@example.com" };
        Player.create.mockResolvedValue(mockPlayer);

        // Act
        const response = await request(app)
          .post("/players")
          .set("Authorization", "Bearer valid.admin.token")
          .send({ username: "newplayer", email: "new@example.com", password: "password123" });

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      it("should deny user access to create player", async () => {
        // Arrange
        authService.verifyToken.mockReturnValue({
          id: 1,
          username: "testuser",
          role: "user",
        });
        authService.getUserById.mockResolvedValue({
          id: 1,
          username: "testuser",
          role: "user",
        });

        // Act
        const response = await request(app)
          .post("/players")
          .set("Authorization", "Bearer valid.user.token")
          .send({ username: "newplayer", email: "new@example.com", password: "password123" });

        // Assert
        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain("Access denied");
      });

      it("should deny access without authentication", async () => {
        // Act
        const response = await request(app)
          .post("/players")
          .send({ username: "newplayer", email: "new@example.com", password: "password123" });

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Authentication token is required");
      });
    });
  });
});
