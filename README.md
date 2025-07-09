# Riddles Server

A Node.js riddles server using Express framework and json-file-crud package.

## Features

- Built with Express.js framework
- RESTful API with Express routing
- CRUD operations for riddles
- File-based JSON storage
- Automatic ID generation
- Express middleware for error handling

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/riddles`                | Get all riddles         |
| POST   | `/riddles/addRiddle`      | Add a new riddle        |
| PUT    | `/riddles/updateRiddle`   | Update a riddle by ID   |
| DELETE | `/riddles/deleteRiddle`   | Delete a riddle by ID   |

## Documentation

- Full API documentation: [docs/api.md](docs/api.md)
- Postman collection: [docs/riddles-server.postman_collection.json](docs/riddles-server.postman_collection.json)

## Installation

```bash
npm install
```

## Usage

```bash
# Start the server
npm start

# Development mode with auto-restart (if defined)
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
  -d '{"name": "חידה חדשה", "taskDescription": "מה הולך ובא ולא מגיע אף פעם?", "correctAnswer": "מחר"}'
```

### Update Riddle
```bash
curl -X PUT http://localhost:3000/riddles/updateRiddle \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "name": "עודכן", "taskDescription": "עודכן", "correctAnswer": "עודכן"}'
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
│   │   └── riddleValidator.js
│   └── config/                 # Configuration
│       └── database.js
├── data/
│   └── riddles.json            # Data storage file
├── docs/                       # Documentation
│   ├── api.md
│   └── riddles-server.postman_collection.json
└── package.json
```

