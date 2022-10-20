const express = require("express");

const app = express();
app.listen(8000, () => {
  console.log("Success: listening for requests on port 8000...");
});

app.get("/books", (req, res) => {
  res.json({ message: "response successful from /books" });
});