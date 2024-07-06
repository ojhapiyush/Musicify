const mongoose = require("mongoose");

const publicPlaylistSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  playlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
  },
});

const PublicPlaylist = mongoose.model("PublicPlaylist", publicPlaylistSchema);

module.exports = PublicPlaylist;
