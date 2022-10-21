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
  res.json({ message: "response successful from /books" });
});
