# Riddles Game Server

A modern Node.js riddles server with cloud database integration, player management, and scoring system.

## Overview

This project is a backend server that manages a collection of riddles and tracks how well players solve them. Built with modern ES modules and comprehensive testing. The server uses these cloud databases:

- **MongoDB Atlas** for riddles storage
- **Supabase (PostgreSQL)** for players and score tracking

## Features

### Technical Features

- RESTful API with Express.js
- JWT-based authentication system
- Role-based access control (user/admin)
- Password hashing with bcrypt
- Cloud database integration (MongoDB + Supabase)
- Centralized error handling
- Request logging and monitoring
- Health check endpoints
- Graceful shutdown handling
- Connection pooling
- Comprehensive testing suite with Vitest
- Silent testing environment

### Business Features

- User registration and authentication
- Riddle management (CRUD operations)
- Player profiles and statistics
- Score tracking and leaderboards
- Admin-only operations
- Protected API endpoints

## Project Structure

```
riddles-server/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── authController.js     # Authentication logic
│   │   ├── playersController.js  # Player operations
│   │   └── riddlesController.js  # Riddle management
│   ├── middleware/           # Express middleware
│   │   ├── authMiddleware.js     # JWT & role validation
│   │   ├── errorHandler.js      # Global error handling
│   │   └── requestLogger.js     # Request logging
│   ├── models/              # Data models
│   │   ├── Player.js            # Player data model
│   │   └── Riddle.js            # Riddle data model
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── playersRoutes.js     # Player endpoints
│   │   ├── riddlesRoutes.js     # Riddle endpoints
│   │   └── rootRoutes.js        # Root & health endpoints
│   ├── services/            # Business logic
│   │   └── authService.js       # Auth operations
│   ├── db/                  # Database connections
│   │   ├── mongodb.js           # MongoDB setup
│   │   └── supabase.js          # Supabase setup
│   └── server.js            # Main server file
├── test/                    # Test suite
│   ├── setup.js                 # Global test config
│   ├── unit/                    # Unit tests
│   │   └── authService.test.js
│   └── integration/             # Integration tests
│       ├── authRoutes.test.js
│       └── protectedRoutes.test.js
├── database/                # Database scripts
│   └── auth_migration.sql       # SQL migrations
├── docs/                    # Documentation
│   └── api.md                   # API documentation
├── .env.example             # Environment template
├── package.json             # Dependencies
└── README.md               # This file
```

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

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
ADMIN_SECRET_CODE=your-admin-registration-code

# Server Configuration
PORT=3000
NODE_ENV=development
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
| GET    | `/players/leaderboard`  | Get top players leaderboard      | Yes (User)    |
| POST   | `/players`              | Create new player                | Yes (Admin)   |
| GET    | `/players/:username`    | Get player stats and history     | Required*     |
| POST   | `/players/submit-score` | Submit solving time for a riddle | Yes (User)    |

*Authentication levels for player stats:
- Without token: Access denied (401)
- With user token: Returns basic public player information
- With admin token or own profile: Returns enhanced private details

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
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{"username": "player1"}'
```

### Submit Score

```bash
curl -X POST http://localhost:3000/players/submit-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "player1",
    "riddleId": "507f1f77bcf86cd799439011",
    "timeToSolve": 5000
  }'
```

### Get Leaderboard

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/players/leaderboard?limit=10
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

### Phase 5: Testing Infrastructure (Completed)

- ✔ JWT-based authentication
- ✔ User registration and login
- ✔ Password hashing with bcrypt
- ✔ Role-based access control (user/admin)
- ✔ Admin-only routes protection
- ✔ Secure environment variables
- ✔ Unit tests for authentication service
- ✔ Integration tests for auth routes
- ✔ Integration tests for protected routes
- ✔ Silent testing (no console output during tests)

## Testing

### Test Structure

The project includes comprehensive testing with Vitest (ES modules native support):

```
test/
├── setup.js                      # Global test configuration
├── unit/
│   └── authService.test.js       # Authentication service unit tests
└── integration/
    ├── authRoutes.test.js        # Authentication endpoints tests
    └── protectedRoutes.test.js   # Route protection tests
```

Configuration file: `vitest.config.js`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (interactive)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Features

- **Unit Testing**: Core authentication logic
- **Integration Testing**: Full API endpoint testing
- **Mocked Dependencies**: Database and external services mocked
- **Silent Testing**: No console output during test runs
- **Role-based Testing**: Tests for user and admin access levels

### Authentication Testing

Tests cover:
- Password hashing and verification
- JWT token generation and validation
- User registration (regular and admin)
- Login/logout functionality
- Protected route access control
- Role-based permissions

Example test output:

```
 RUN  v3.2.4
 ✓ test/unit/authService.test.js (17 tests)
 ✓ test/integration/authRoutes.test.js (17 tests)  
 ✓ test/integration/protectedRoutes.test.js (21 tests)

 Test Files  3 passed (3)
      Tests  55 passed (55)
```

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
