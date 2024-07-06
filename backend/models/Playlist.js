const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlaylistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  tracks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Track",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = Playlist;
