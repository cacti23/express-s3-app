require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const connectDB = require("./utils/connectDb");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const app = express();

app.use(express.json());

connectDB();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/api/posts", async (req, res) => {
  res.send({ message: "inside get -> posts" });
});

app.post("/api/posts", upload.single("image"), async (req, res) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);

  res.send({ message: "inside post -> posts" });
});

app.delete("/api/posts/:id", async (req, res) => {
  res.send({ message: "inside delete -> posts" });
});

app.listen(8080, () => console.log("Server started on port 8080"));
