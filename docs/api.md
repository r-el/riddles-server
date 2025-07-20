# Riddles Server API Documentation

Version 2.0.0 - Cloud Database Edition

## Base URL
```
http://localhost:3000
```

## Quick Links
- [Riddles API](#-riddles-api)
- [Players API](#-players-api)
- [System API](#-system-api)
- [Error Responses](#-error-responses)

---

## Riddles API

### Get All Riddles
Get a list of all riddles with optional filtering and pagination.

**Endpoint:** `GET /riddles`

**Query Parameters:**
- `level` (optional) - Filter by difficulty level (`easy`, `medium`, `hard`)
- `limit` (optional) - Number of riddles to return (default: 50)
- `skip` (optional) - Number of riddles to skip for pagination (default: 0)

**Example Request:**
```bash
curl "http://localhost:3000/riddles?level=easy&limit=10"
```

**Example Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "question": "What has keys but cannot open locks?",
      "answer": "Piano",
      "level": "easy",
      "createdAt": "2025-07-20T14:19:47.794Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "question": "What goes up but never comes down?",
      "answer": "Age",
      "level": "medium",
      "createdAt": "2025-07-20T14:20:15.123Z"
    }
  ]
}
```

### Get Random Riddle
Get a randomly selected riddle from the database.

**Endpoint:** `GET /riddles/random`

**Example Request:**
```bash
curl http://localhost:3000/riddles/random
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "question": "What has keys but cannot open locks?",
    "answer": "Piano",
    "level": "easy",
    "createdAt": "2025-07-20T14:19:47.794Z"
  }
}
```

### Get Riddle by ID
Get a specific riddle by its MongoDB ObjectId.

**Endpoint:** `GET /riddles/:id`

**Path Parameters:**
- `id` - MongoDB ObjectId of the riddle

**Example Request:**
```bash
curl http://localhost:3000/riddles/507f1f77bcf86cd799439011
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "question": "What has keys but cannot open locks?",
    "answer": "Piano",
    "level": "easy",
    "createdAt": "2025-07-20T14:19:47.794Z"
  }
}
```

### Create New Riddle
Add a new riddle to the database.

**Endpoint:** `POST /riddles`

**Request Body:**
```json
{
  "question": "What has keys but cannot open locks?",
  "answer": "Piano",
  "level": "easy"
}
```

**Field Requirements:**
- `question` (required) - The riddle question
- `answer` (required) - The correct answer
- `level` (optional) - Difficulty level: `easy`, `medium`, `hard` (default: `medium`)

**Example Request:**
```bash
curl -X POST http://localhost:3000/riddles \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What has keys but cannot open locks?",
    "answer": "Piano",
    "level": "easy"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Riddle created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "question": "What has keys but cannot open locks?",
    "answer": "Piano",
    "level": "easy",
    "createdAt": "2025-07-20T14:25:30.456Z"
  }
}
```

### Update Riddle
Update an existing riddle by ID.

**Endpoint:** `PUT /riddles/:id`

**Path Parameters:**
- `id` - MongoDB ObjectId of the riddle to update

**Request Body:**
```json
{
  "question": "Updated question",
  "answer": "Updated answer",
  "level": "hard"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/riddles/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What has keys but cannot open locks?",
    "answer": "Keyboard",
    "level": "medium"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Riddle updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "question": "What has keys but cannot open locks?",
    "answer": "Keyboard",
    "level": "medium",
    "createdAt": "2025-07-20T14:19:47.794Z"
  }
}
```

### Delete Riddle
Delete a riddle from the database.

**Endpoint:** `DELETE /riddles/:id`

**Path Parameters:**
- `id` - MongoDB ObjectId of the riddle to delete

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/riddles/507f1f77bcf86cd799439011
```

**Example Response:**
```json
{
  "success": true,
  "message": "Riddle deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011"
  }
}
```

### Load Initial Riddles
Bulk load multiple riddles at once (useful for initial setup).

**Endpoint:** `POST /riddles/load-initial`

**Request Body:**
```json
{
  "riddles": [
    {
      "question": "What has keys but cannot open locks?",
      "answer": "Piano",
      "level": "easy"
    },
    {
      "question": "What goes up but never comes down?",
      "answer": "Age",
      "level": "medium"
    }
  ]
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/riddles/load-initial \
  -H "Content-Type: application/json" \
  -d '{
    "riddles": [
      {
        "question": "What has keys but cannot open locks?",
        "answer": "Piano",
        "level": "easy"
      },
      {
        "question": "What goes up but never comes down?",
        "answer": "Age", 
        "level": "medium"
      }
    ]
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Successfully loaded 2 riddles",
  "data": {
    "success": true,
    "inserted": 2,
    "ids": {
      "0": "507f1f77bcf86cd799439014",
      "1": "507f1f77bcf86cd799439015"
    }
  }
}
```

---

## Players API

### Create Player
Create a new player account.

**Endpoint:** `POST /players`

**Request Body:**
```json
{
  "username": "player1"
}
```

**Field Requirements:**
- `username` (required) - Unique player username

**Example Request:**
```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{"username": "player1"}'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Player created successfully",
  "data": {
    "id": 1,
    "username": "player1",
    "created_at": "2025-07-20T14:20:06.389364",
    "best_time": 0
  }
}
```

### Get Player Stats
Get detailed statistics and history for a player.

**Endpoint:** `GET /players/:username`

**Path Parameters:**
- `username` - Player's username

**Example Request:**
```bash
curl http://localhost:3000/players/player1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "player": {
      "id": 1,
      "username": "player1",
      "created_at": "2025-07-20T14:20:06.389364",
      "best_time": 5000
    },
    "stats": {
      "total_solved": 3,
      "avg_time": 7500,
      "best_time": 5000
    },
    "history": [
      {
        "riddle_id": "507f1f77bcf86cd799439011",
        "time_to_solve": 5000,
        "solved_at": "2025-07-20T14:25:00.000Z"
      },
      {
        "riddle_id": "507f1f77bcf86cd799439012",
        "time_to_solve": 8000,
        "solved_at": "2025-07-20T14:24:00.000Z"
      }
    ]
  }
}
```

### Submit Score
Submit a player's solving time for a specific riddle.

**Endpoint:** `POST /players/submit-score`

**Request Body:**
```json
{
  "username": "player1",
  "riddleId": "507f1f77bcf86cd799439011",
  "timeToSolve": 5000
}
```

**Field Requirements:**
- `username` (required) - Player's username
- `riddleId` (required) - MongoDB ObjectId of the solved riddle
- `timeToSolve` (required) - Time taken to solve in milliseconds

**Example Request:**
```bash
curl -X POST http://localhost:3000/players/submit-score \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "riddleId": "507f1f77bcf86cd799439011",
    "timeToSolve": 5000
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Score submitted successfully"
}
```

### Get Leaderboard
Get the top players ranked by their best solving times.

**Endpoint:** `GET /players/leaderboard`

**Query Parameters:**
- `limit` (optional) - Number of top players to return (default: 10)

**Example Request:**
```bash
curl "http://localhost:3000/players/leaderboard?limit=5"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "speedster",
      "best_time": 3000,
      "riddles_solved": 5
    },
    {
      "id": 2,
      "username": "player1",
      "best_time": 5000,
      "riddles_solved": 3
    },
    {
      "id": 3,
      "username": "thinker",
      "best_time": 8000,
      "riddles_solved": 7
    }
  ]
}
```

---

## System API

### API Information
Get information about available endpoints and server status.

**Endpoint:** `GET /`

**Example Request:**
```bash
curl http://localhost:3000/
```

**Example Response:**
```json
{
  "message": "Welcome to Riddles Server!",
  "version": "2.0.0",
  "features": {
    "databases": ["MongoDB (Riddles)", "Supabase (Players)"],
    "riddles": [
      "GET /riddles - Get all riddles",
      "GET /riddles/random - Get random riddle",
      "..."
    ],
    "players": [
      "GET /players/leaderboard - Get leaderboard",
      "POST /players - Create player",
      "..."
    ],
    "system": [
      "GET /health - Health check"
    ]
  },
  "timestamp": "2025-07-20T14:19:19.010Z"
}
```

### Health Check
Check server health and uptime.

**Endpoint:** `GET /health`

**Example Request:**
```bash
curl http://localhost:3000/health
```

**Example Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-20T14:19:28.827Z",
  "uptime": 26.640112782
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error description"
}
```

### Common HTTP Status Codes

| Code | Description | Example |
|------|-------------|---------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request body or parameters |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., username exists) |
| 500 | Server Error | Internal server error |

### Example Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Missing required fields: username, riddleId, timeToSolve"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Riddle not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "error": "Username already exists"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "error": "Database connection failed"
}
```
