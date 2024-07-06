const mongoose = require("mongoose");
const { Schema } = mongoose;

const TrackSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  artist: {
    type: String,
    required: true,
  },
  albumArt: {
    type: String,
    required: true,
  },
  file_url: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  playlist: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Track = mongoose.model("Track", TrackSchema);
module.exports = Track;
