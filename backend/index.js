const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const connectToMongo = require("./db");
const express = require("express");
const cloudinary = require("cloudinary").v2;

var cors = require("cors");
connectToMongo();

cloudinary.config({
  cloud_name: process.env.CloudinaryCloudName,
  api_key: process.env.CloudinaryCloudApiKey,
  api_secret: process.env.CloudinaryCloudApiSecret,
});

var app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`Musicify backend listening on port ${port}`);
  //   console.log(process.env.MONGO_URI);
});
