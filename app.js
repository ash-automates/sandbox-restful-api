const express = require("express");
const { connectToDB, getDB } = require("./db");
require("dotenv").config();

const app = express();

let database;
connectToDB((error) => {
  if (!error) {
    database = getDB();
    app.listen(8000, () => {
      console.log("Success: listening for requests on port 8000...");
    });
  }
});

app.get("/books", (req, res) => {
  let books = [];
  database
    .collection("books")
    .find()
    .sort({ author: 1 })
    .forEach((book) => {
      books.push(book);
    })
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
});
