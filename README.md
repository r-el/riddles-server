# Riddles Game Server

A modern Node.js riddles server with cloud database integration, player management, and scoring system.

## Overview

This project is a backend server that manages a collection of riddles and tracks how well players solve them. The server uses these cloud databases:

- **MongoDB Atlas** for riddles storage
- **Supabase (PostgreSQL)** for players and score tracking

## Features

### Technical Features

- RESTful API with Express.js
- Cloud database integration (MongoDB + Supabase)
- Centralized error handling
- Request logging and monitoring
- Health check endpoints
- Graceful shutdown handling
- Connection pooling

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/r-el/riddles-server
cd riddles-server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Environment Setup

Edit `.env` file with your credentials:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=riddles_game

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key

# Server Configuration
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Database Setup

#### Supabase Tables

Create these tables in your Supabase database:

```sql
-- Players table
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  best_time INTEGER DEFAULT 0
);

-- Player scores table
CREATE TABLE player_scores (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  riddle_id TEXT,
  time_to_solve INTEGER,
  solved_at TIMESTAMP DEFAULT NOW()
);
```

### Start the Server

```bash
# Production mode
npm start

# Development mode with auto-restart
npm run dev
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint          | Description                  | Auth Required |
| ------ | ----------------- | ---------------------------- | ------------- |
| POST   | `/auth/register`  | Register new user            | No            |
| POST   | `/auth/login`     | Login user                   | No            |
| POST   | `/auth/logout`    | Logout user                  | Yes           |
| GET    | `/auth/profile`   | Get current user profile     | Yes           |
| PUT    | `/auth/profile`   | Update user profile          | Yes           |

### Riddles Endpoints

| Method | Endpoint                | Description                       | Auth Required |
| ------ | ----------------------- | --------------------------------- | ------------- |
| GET    | `/riddles`              | Get all riddles (with pagination) | Yes (User)    |
| GET    | `/riddles/random`       | Get a random riddle               | No            |
| GET    | `/riddles/:id`          | Get specific riddle by ID         | Yes (User)    |
| POST   | `/riddles`              | Create a new riddle               | Yes (User)    |
| PUT    | `/riddles/:id`          | Update existing riddle            | Yes (User)    |
| DELETE | `/riddles/:id`          | Delete riddle                     | Yes (Admin)   |
| POST   | `/riddles/load-initial` | Bulk load initial riddles         | Yes (Admin)   |

### Players Endpoints

| Method | Endpoint                | Description                      | Auth Required |
| ------ | ----------------------- | -------------------------------- | ------------- |
| GET    | `/players`              | Get all players (admin only)     | Yes (Admin)   |
| POST   | `/players`              | Create new player                | Yes (User)    |
| GET    | `/players/:username`    | Get player stats and history     | Yes (User)    |
| POST   | `/players/submit-score` | Submit solving time for a riddle | Yes (User)    |
| GET    | `/players/leaderboard`  | Get top players leaderboard      | Yes (User)    |

### System Endpoints

| Method | Endpoint  | Description                        |
| ------ | --------- | ---------------------------------- |
| GET    | `/`       | API information and endpoints list |
| GET    | `/health` | Server health check                |

## API Examples

### Authentication

#### Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

#### Register Admin User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "password": "securePassword123",
    "adminCode": "your-admin-secret-code"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "role": "user"
    }
  }
}
```

#### Using Authentication Token

For protected routes, include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/riddles
```

### Get All Riddles

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/riddles
```

Response:

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
    }
  ]
}
```

### Create New Riddle

```bash
curl -X POST http://localhost:3000/riddles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "question": "What has keys but cannot open locks?",
    "answer": "Piano",
    "level": "easy"
  }'
```

### Create Player

```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{"username": "player1"}'
```

### Submit Score

```bash
curl -X POST http://localhost:3000/players/submit-score \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "riddleId": "507f1f77bcf86cd799439011",
    "timeToSolve": 5000
  }'
```

### Get Leaderboard

```bash
curl http://localhost:3000/players/leaderboard?limit=10
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "player1",
      "best_time": 5000,
      "riddles_solved": 3
    }
  ]
}
```

## Project Structure

```
riddles-server/
├── index.js                     # Main entry point
├── src/
│   ├── server.js                # Express app configuration
│   ├── controllers/             # Request handlers
│   │   ├── riddlesController.js # Riddles CRUD operations (API)
│   │   └── playersController.js # Players and scoring (API)
│   ├── models/                  # Data models
│   │   ├── Riddle.js           # MongoDB riddle model
│   │   └── Player.js           # Supabase player model
│   ├── db/                     # Database connections
│   │   ├── mongodb.js          # MongoDB Atlas connection
│   │   └── supabase.js         # Supabase connection
│   ├── routes/                 # Route definitions
│   │   ├── riddlesRoutes.js    # Riddles API routes
│   │   ├── playersRoutes.js    # Players API routes
│   │   └── rootRoutes.js       # Root and info routes
│   ├── middleware/             # Custom middleware
│   │   ├── errorHandler.js     # Centralized error handling
│   │   └── requestLogger.js    # Request logging
│   └── config/                 # Configuration files
│       └── database.js         # Database configuration
├── .env.example                # Environment variables template
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Technology Stack

| Component             | Technology            | Purpose                                 |
| --------------------- | --------------------- | --------------------------------------- |
| **Backend Framework** | Node.js + Express.js  | REST API server                         |
| **Riddles Database**  | MongoDB Atlas         | Cloud document storage                  |
| **Players Database**  | Supabase (PostgreSQL) | Relational data with real-time features |

## Development Workflow

### Phase 1: File System (Completed)

- ✔ Local JSON file storage
- ✔ Basic CRUD operations
- ✔ Express server setup

### Phase 2: Express Enhancement (Completed)

- ✔ RESTful API design
- ✔ Middleware integration
- ✔ Error handling

### Phase 3: Database Migration (Current)

- ✔ MongoDB integration for riddles
- ✔ Supabase integration for players
- ✔ Data model refactoring
- ✔ Connection pooling

## Error Handling

The server includes error handling:

```javascript
// Centralized error responses
{
  "success": false,
  "error": "Error message",
  "stack": "Stack trace (development only)"
}
```

## Health Monitoring

Check server status:

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "OK",
  "timestamp": "2025-07-20T14:19:28.827Z",
  "uptime": 26.640112782
}
```

## Debugging

### Logs Location

Server logs are printed to console with timestamps:

```
2025-07-20T14:19:19.010Z - GET / - IP: ::1
✔ MongoDB connection established successfully
✔ Supabase connection successful
```

### Common Issues

1. **MongoDB Connection Failed**

   - Check `MONGODB_URI` in `.env`
   - Verify network access to Atlas cluster
   - Check credentials and permissions

2. **Supabase Connection Failed**

   - Check `SUPABASE_URL` and `SUPABASE_KEY`
   - Verify project is active
   - Check API key permissions

3. **Port Already in Use**
   - Change `PORT` in `.env`
   - Kill existing processes: `killall node`
