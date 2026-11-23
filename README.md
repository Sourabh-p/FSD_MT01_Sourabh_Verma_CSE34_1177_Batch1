# Library Book Management API (Set A)

REST API built with Node.js and Express.js. Data is stored in an in-memory JavaScript array (no database).

## Setup
```bash
npm install
```

## Run
```bash
node server.js
```
Server starts at `http://localhost:3000`.

## Endpoints
| Method | URL | Description | Success | Error |
|--------|-----|-------------|---------|-------|
| GET | /api/books | Get all books | 200 | – |
| POST | /api/books | Add a book | 201 | 400 |
| GET | /api/books/:id | Get book by ID | 200 | 404 |
| PUT | /api/books/:id | Update a book | 200 | 400 / 404 |
| DELETE | /api/books/:id | Delete a book | 200 | 404 |
| GET | /api/books/filter?author=value | Filter by author (case-insensitive) | 200 | 400 (missing param) |

## Sample POST body
```json
{
  "title": "The Discovery of India",
  "author": "Jawaharlal Nehru",
  "genre": "History",
  "publishedYear": 1946,
  "available": true
}
```