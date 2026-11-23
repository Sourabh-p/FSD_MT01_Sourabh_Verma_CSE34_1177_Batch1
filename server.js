const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
  { id: 101, title: "Wings of Fire", author: "A.P.J. Abdul Kalam", genre: "Autobiography", publishedYear: 1999, available: true },
  { id: 102, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", publishedYear: 1988, available: true },
  { id: 103, title: "Harry Potter", author: "J.K. Rowling", genre: "Fantasy", publishedYear: 1997, available: false },
];

const isNonEmptyString = (v) => typeof v === "string" && v.trim() !== "";

function validateBook(body) {
  if (!body || typeof body !== "object") return "Request body must be a JSON object";
  const { title, author, genre, publishedYear, available } = body;
  if (!isNonEmptyString(title)) return "title is required and must be a non-empty string";
  if (!isNonEmptyString(author)) return "author is required and must be a non-empty string";
  if (!isNonEmptyString(genre)) return "genre is required and must be a non-empty string";
  if (!Number.isInteger(publishedYear)) return "publishedYear is required and must be a number";
  if (typeof available !== "boolean") return "available is required and must be a boolean";
  return null;
}

function nextId() {
  return books.length ? Math.max(...books.map((b) => b.id)) + 1 : 101;
}


app.get("/api/books", (req, res) => {
  res.status(200).json(books);
});

app.get("/api/books/filter", (req, res) => {
  const { author } = req.query;
  if (!isNonEmptyString(author)) {
    return res.status(400).json({ error: "author query parameter is required" });
  }
  const result = books.filter(
    (b) => b.author.toLowerCase() === author.trim().toLowerCase()
  );
  res.status(200).json(result); 
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.status(200).json(book);
});

// 2. POST new book
app.post("/api/books", (req, res) => {
  const error = validateBook(req.body);
  if (error) return res.status(400).json({ error });

  const { title, author, genre, publishedYear, available } = req.body;
  const newBook = {
    id: nextId(),
    title: title.trim(),
    author: author.trim(),
    genre: genre.trim(),
    publishedYear,
    available,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put("/api/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const error = validateBook(req.body);
  if (error) return res.status(400).json({ error });

  const { title, author, genre, publishedYear, available } = req.body;
  books[index] = {
    id: books[index].id,
    title: title.trim(),
    author: author.trim(),
    genre: genre.trim(),
    publishedYear,
    available,
  };
  res.status(200).json(books[index]);
});

app.delete("/api/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const [removed] = books.splice(index, 1);
  res.status(200).json({ message: "Book deleted successfully", book: removed });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  res.status(500).json({ error: "Internal server error" });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Library Book Management API running at http://localhost:${PORT}`);
});