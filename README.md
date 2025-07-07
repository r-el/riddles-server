# Riddles Server

A Node.js riddles server using vanilla HTTP module and json-file-crud package.

## Features

- Built with vanilla Node.js (no Express)
- Uses only core modules (http, url)
- CRUD operations for riddles
- File-based JSON storage
- Automatic ID generation
- RESTful API endpoints

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/riddles` | Get all riddles |
| POST | `/riddles/addRiddle` | Add a new riddle |
| PUT | `/riddles/updateRiddle` | Update a riddle by ID |
| DELETE | `/riddles/deleteRiddle` | Delete a riddle by ID |

## Installation

```bash
npm install
```

## Usage

```bash
# Start the server
npm start

# Development mode with auto-restart
npm run dev
```

## API Examples

### Get All Riddles
```bash
curl http://localhost:3000/riddles
```

### Add New Riddle
```bash
curl -X POST http://localhost:3000/riddles/addRiddle \
  -H "Content-Type: application/json" \
  -d '{"question": "What has a head and a tail but no body?", "answer": "A coin"}'
```

### Update Riddle
```bash
curl -X PUT http://localhost:3000/riddles/updateRiddle \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "question": "Updated question?", "answer": "Updated answer!"}'
```

### Delete Riddle
```bash
curl -X DELETE http://localhost:3000/riddles/deleteRiddle \
  -H "Content-Type: application/json" \
  -d '{"id": 1}'
```

## Project Structure

```
riddles-server/
├── server.js                    # Main server entry point
├── src/
│   ├── controllers/            # Business logic & HTTP handling
│   │   └── riddlesController.js
│   ├── models/                 # Data models & validation
│   │   └── Riddle.js
│   ├── dal/                    # Data Access Layer
│   │   └── riddlesDAL.js
│   ├── routes/                 # Route definitions
│   │   └── riddlesRoutes.js
│   ├── middleware/             # Custom middleware
│   │   ├── errorHandler.js
│   │   └── requestParser.js
│   ├── utils/                  # Utility functions
│   │   ├── responseHelper.js
│   │   └── validation.js
│   └── config/                 # Configuration
│       └── database.js
├── data/
│   └── riddles.json            # Data storage file
├── docs/                       # Documentation
│   └── api.md
└── package.json
```

