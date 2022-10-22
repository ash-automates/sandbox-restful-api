const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDB, getDB } = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

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
  const page = req.query.page || 0;
  const documentsPerPage = 3;
  database
    .collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * documentsPerPage)
    .limit(documentsPerPage)
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

app.post("/books", (req, res) => {
  database
    .collection("books")
    .insertOne(req.body)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not create the document" });
    });
});

app.patch("/books/:id", (req, res) => {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    database
      .collection("books")
      .updateOne({ _id: ObjectId(id) }, { $set: req.body })
      .then((result) => {
        if (result.matchedCount === 0) {
          res.status(500).json({ error: "Could not find the document" });
        } else {
          res.status(200).json(result);
        }
      })
      .catch(() => {
        res.status(500).json({ error: "Could not update the document" });
      });
  } else {
    res.status(500).json({ error: "Please enter a valid id" });
  }
});
