require("dotenv").config();
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const connectDB = require("./utils/connectDb");
const Post = require("./schemas/post");

const randomImageNames = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

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
  const imageName = randomImageNames();
  // resize image
  const fileBuffer = await sharp(req.file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer();

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: imageName,
    Body: fileBuffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);

  const newPost = await Post.create({
    imageName: imageName,
    caption: req.body.caption,
  });

  res.send(newPost);
});

app.delete("/api/posts/:id", async (req, res) => {
  res.send({ message: "inside delete -> posts" });
});

app.listen(8080, () => console.log("Server started on port 8080"));
