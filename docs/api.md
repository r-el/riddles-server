# Riddles Server API Documentation

## Endpoints

### Get All Riddles
- **GET** `/riddles`
- **Response:**
```json
[
  {
    "id": 1,
    "name": "חידה לדוגמה",
    "taskDescription": "מה הולך ובא ולא מגיע אף פעם?",
    "correctAnswer": "מחר"
  }
]
```

### Add Riddle
- **POST** `/riddles/addRiddle`
- **Body:**
```json
{
  "name": "שם החידה",
  "taskDescription": "תיאור החידה",
  "correctAnswer": "תשובה נכונה"
}
```
- **Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Riddle added successfully"
}
```

### Update Riddle
- **PUT** `/riddles/updateRiddle`
- **Body:**
```json
{
  "id": 1,
  "name": "שם חדש",
  "taskDescription": "תיאור חדש",
  "correctAnswer": "תשובה חדשה"
}
```
- **Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Riddle updated successfully"
}
```

### Delete Riddle
- **DELETE** `/riddles/deleteRiddle`
- **Body:**
```json
{
  "id": 1
}
```
- **Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Riddle deleted successfully"
}
```

## Data Model

| Field           | Type    | Description                |
|-----------------|---------|----------------------------|
| id              | number  | Unique identifier (auto)   |
| name            | string  | Riddle name/title          |
| taskDescription | string  | Riddle description         |
| correctAnswer   | string  | The correct answer         |

## Error Response Example
```json
{
  "success": false,
  "error": "Missing id in request body"
}
```

## Notes
- All requests/responses are in JSON.
- For POST/PUT/DELETE, set header: `Content-Type: application/json`.
- For more examples, see `docs/riddles-server.postman_collection.json`.
