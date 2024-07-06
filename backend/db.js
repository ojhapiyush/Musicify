const mongoose = require("mongoose");

const server = "127.0.0.1:27017";
const database = "MusicPlayer";


const MongoAtlasURI = process.env.MongoAtlasURI;

const connectToMongo = async () => {
  //   mongoose.set("strictQuery", false);
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MongoAtlasURI);
    console.log("Connected to MongoAtlas");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
};

module.exports = connectToMongo;
