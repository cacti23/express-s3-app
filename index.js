const express = require("express");
const multer = require("multer");

const connectDB = require("./utils/connectDb");
require("dotenv").config();

const app = express();

app.use(express.json());

connectDB();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/api/posts", async (req, res) => {
  res.send({ message: "inside get -> posts" });
});

app.post("/api/posts", upload.single("image"), async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);

  res.send({ message: "inside post -> posts" });
});

app.delete("/api/posts/:id", async (req, res) => {
  res.send({ message: "inside delete -> posts" });
});

app.listen(8080, () => console.log("Server started on port 8080"));
