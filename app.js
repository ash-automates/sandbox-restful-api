const express = require("express");
const { ObjectId } = require("mongodb");
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

app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    database
      .collection("books")
      .findOne({ _id: ObjectId(id) })
      .then((book) => {
        if (book === null) {
          res.status(500).json({ error: "Please enter a valid id" });
        } else {
          res.status(200).json(book);
        }
      })
      .catch(() => {
        res.status(500).json({ error: "Could not fetch the document" });
      });
  } else {
    res.status(500).json({ error: "Please enter a valid id" });
  }
});

app.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    database
      .collection("books")
      .deleteOne({ _id: ObjectId(id) })
      .then((result) => {
        if (result.deletedCount === 0) {
          res.status(500).json({ error: "Could not find the document" });
        } else {
          res.status(200).json(result);
        }
      })
      .catch(() => {
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ error: "Please enter a valid id" });
  }
});
