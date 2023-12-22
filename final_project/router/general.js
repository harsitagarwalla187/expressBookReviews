const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(404)
      .json({ message: "Username or password not provided" });

  if (isValid(username)) {
    if (users[username]) {
      return res.status(404).json({ message: "Username already exists" });
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User registered successfully" });
    }
  } else {
    return res.status(404).json({ message: " Username not valid!" });
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  let promise = new Promise((resolve, reject) => {
    if (books) resolve(books);
    else reject("Error fetching book");
  });

  promise
    .then((books) => {
      return res.status(300).send(books);
    })
    .catch((err) => {
      return res.status(404).json({ message: "Error fetching book" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) resolve(books[isbn]);
    else reject("Error fetching book");
  });

  promise
    .then((book) => {
      return res.status(300).send(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: "Error fetching book" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const author = req.params.author;
    const filteredBooks = [];
    for (let isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        if (books[isbn].author === author) {
          filteredBooks.push(books[isbn]);
        }
      }
    }
    if (filteredBooks.length > 0) resolve(filteredBooks);
    else reject("Error fetching book");
  });

  promise
    .then((books) => {
      return res.status(300).send(books);
    })
    .catch((err) => {
      return res.status(404).json({ message: "Error fetching book" });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const title = req.params.title;
    const filteredBooks = [];
    for (let isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        if (books[isbn].title === title) {
          filteredBooks.push(books[isbn]);
        }
      }
    }
    if (filteredBooks.length > 0) resolve(filteredBooks);
    else reject("Error fetching book");
  });

  promise
    .then((books) => {
      return res.status(300).send(books);
    })
    .catch((err) => {
      return res.status(404).json({ message: "Error fetching book" });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const review = books[req.params.isbn].reviews;
  return res.status(300).send(review);
});

module.exports.general = public_users;
