const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./utils/connectDb");
require("dotenv").config();

const app = express();

app.use(express.json());

connectDB();

app.get("/api/posts", async (req, res) => {
  res.send({ message: "inside get -> posts" });
});

app.post("/api/posts", async (req, res) => {
  res.send({ message: "inside post -> posts" });
});

app.delete("/api/posts/:id", async (req, res) => {
  res.send({ message: "inside delete -> posts" });
});

app.listen(8080, () => console.log("Server started on port 8080"));
