const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Playlist = require("../models/Playlist");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "MusicPlayer";

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const Track = require("../models/Track");
const PublicPlaylist = require("../models/PublicPlaylist");

const storage = multer.diskStorage({});
let upload = multer({
  storage,
});

// (Create a User)
router.post(
  "/createUser",
  [
    body("username", "Enter a valid username").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password length should be atleast 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ username: req.body.username });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "User with this username already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        username: req.body.username,
        password: secPass,
        email: req.body.email,
        playlists: [],
        followers: [],
        following: [],
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: "30d" });
      // console.log(jwtData);
      success = true;
      // res.json(user);
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
    // res.send("hello");
  }
);

// Login a user
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let success = false;
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const passwordComp = await bcrypt.compare(password, user.password);
      if (!passwordComp) {
        success = false;
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: "30d" });
      // console.log(jwtData);

      // res.json(user);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Get logged in User details: POST "/api/auth/getuser"
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getOwner/:id", async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await User.findById(userid);
    res.send({ username: user.username });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Get private/public status of Playlist
router.get("/getpvtStatus/:playlistId", fetchuser, async (req, res) => {
  try {
    const playlistID = req.params.playlistId;
    const playlist = await Playlist.findById(playlistID);
    if (!playlist) {
      return res.status(400).json({ error: "Playlist not found" });
    }
    const temp = await PublicPlaylist.findOne({
      playlistId: playlistID,
      ownerId: playlist.owner,
    });
    if (temp) {
      return res.json({ success: true, status: "public" });
    }
    return res.json({ success: false, status: "private" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// fetch all public playlists
router.get("/getPublicPlaylists", async (req, res) => {
  try {
    const publicPlaylists = await PublicPlaylist.find();
    res.json(publicPlaylists);
  } catch (error) {
    res.status(500).json({ error: "Error getting public playlists" });
  }
});


// fetching playlist(pvt) details
router.get("/getplaylist/:id", fetchuser, async (req, res) => {
  try {
    const playlistId = req.params.id;
    const playlist = await Playlist.findById(playlistId);
    res.send(playlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// fetching details of public playlist
router.get("/getPublicPlaylist/:id", async (req, res) => {
  try {
    const pubPlaylistId = req.params.id;
    const playlist = await PublicPlaylist.findById(pubPlaylistId);
    if (!playlist) {
      return res.status(404).send("Public playlist not found");
    }
    const originalPlaylistId = playlist.playlistId;
    const originalPlaylist = await Playlist.findById(originalPlaylistId);
    if (!originalPlaylist) {
      return res.status(404).send("Original playlist not found");
    }
    return res.send(originalPlaylist);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error");
  }
});


// fetching details of track
router.get("/gettrack/:id", fetchuser, async (req, res) => {
  try {
    const trackID = req.params.id;
    const track = await Track.findById(trackID);
    res.send(track);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// fetching details of track (pvt)
router.get("/gePublicttrack/:id", async (req, res) => {
  try {
    const trackID = req.params.id;
    const track = await Track.findById(trackID);
    res.send(track);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// get tracks of playlist
router.get("/getTracks/:PlaylistID", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const playlistId = req.params.PlaylistID;
    const user = await User.findById(userId).select("playlists");
    if (!user.playlists.includes(playlistId)) {
      return res.status(401).json({ msg: "Unauthorized Playlist" });
    }
    const playlist = await Playlist.findById(playlistId);
    res.json(playlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// get tracks of public playlist
router.get("/getPublicTracks/:PlaylistID", async (req, res) => {
  try {
    const playlistId = req.params.PlaylistID;
    const playlist = await Playlist.findById(playlistId);
    res.json(playlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// create new playlist
router.post(
  "/createPlaylist",
  fetchuser,
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("desc", "Enter a valid description").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let success = false;
    const { name, desc } = req.body;
    try {
      let playlist = await Playlist.findOne({ name: name, owner: userId });
      if (playlist) {
        return res
          .status(400)
          .json({ success, error: "Playlist with same name already exists." });
      }
      const playlistnew = await Playlist.create({
        name: name,
        description: desc,
        tracks: [],
        owner: userId,
      });
      user.playlists.push(playlistnew._id);
      await user.save();
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      res.json({ success, success: "Playlist Successfully Created" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


// uploading file to cloudinary
router.post(
  "/uploadFile",
  fetchuser,
  upload.single("myFile"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    cloudinary.uploader.upload(
      file.path,
      { resource_type: "auto" },
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: "Failed to upload file" });
        }

       res.json({ audioUrl: result.secure_url, publicID: result.public_id });
      }
    );
  }
);


// add track to playlist
router.post(
  "/addTrackToPlaylist/:playlistId",
  fetchuser,
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("artist", "Enter a valid artist name").isLength({ min: 1 }),
    body("albumArt", "Enter a valid album art link").exists(),
    body("file_url", "Enter a valid file url").exists(),
    body("genre", "Enter a valid genre").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const playlistId = req.params.playlistId;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(400).json({ error: "Playlist not found" });
    }
    let success = false;
    const { name, artist, albumArt, file_url, genre } = req.body;
    try {
      let track = await Track.findOne({ name: name, playlist: playlistId });
      if (track) {
        return res
          .status(400)
          .json({ success, error: "Track with same name already exists." });
      }
      const newtrack = await Track.create({
        name: name,
        artist: artist,
        albumArt: albumArt,
        file_url: file_url,
        genre: genre,
        playlist: playlistId,
        likes: [],
      });
      playlist.tracks.push(newtrack);
      success = true;
      await playlist.save();
      res.json({ success: "Track added to playlist" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


// function to get public id of cloudinary asset from url
function getPublicIdfromURL(url) {
  const splitURL = url.split("/");
  const pubidformat = splitURL[splitURL.length - 1];
  const publicID = pubidformat.split(".")[0];
  return publicID;
}


// deleting file from playlist as well as cloudinary
router.delete("/deleteFile/:trackId", fetchuser, async (req, res) => {
  const trackID = req.params.trackId;
  let success = false;
  try {
    const track = await Track.findById(trackID);
    if (!track) {
      return res.status(400).json({ error: "Track not found" });
    }
    const url = track.file_url;
    const publicID = getPublicIdfromURL(url);
    cloudinary.uploader.destroy(publicID, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Failed to delete file" });
      }
    });
    await Track.findByIdAndDelete(trackID);
    const playlistID = track.playlist;
    const playlist = await Playlist.findByIdAndUpdate(
      playlistID,
      { $pull: { tracks: trackID } },
      { new: true }
    );
    success = true;
    res.json({ success: success, msg: "File deleted successfully", playlist });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// making a pvt playlist public
router.post("/public/:playlistId", fetchuser, async (req, res) => {
  try {
    const playListID = req.params.playlistId;
    const playlist = await Playlist.findById(playListID);
    if (!playlist) {
      return res.status(400).json({ error: "Playlist not found" });
    }
    let pubtemp = await PublicPlaylist.findOne({
      playlistId: playListID,
      ownerId: playlist.owner,
    });
    if (pubtemp) {
      return res.status(500).json({ error: "Playlist already public" });
    }
    const publicPlaylist = await PublicPlaylist.create({
      playlistId: playListID,
      ownerId: playlist.owner,
    });
    return res.json({
      playlist: publicPlaylist,
      message: "Playlist successfully made public",
    });
  } catch (error) {
    return res.status(500).json({ error: "Error making playlist public" });
  }
});


// making a public playlist pvt
router.post("/private/:playlistId", fetchuser, async (req, res) => {
  const playlistId = req.params.playlistId;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return res.status(400).json({ error: "Playlist not found" });
  }
  const toPrivatePlaylist = await PublicPlaylist.findOne({
    playlistId: playlistId,
    ownerId: playlist.owner,
  });
  if (!toPrivatePlaylist) {
    return res.status(500).json({ error: "Playlist already private" });
  }
  // console.log(toPrivatePlaylist);
  if (toPrivatePlaylist) {
    await PublicPlaylist.findByIdAndDelete(toPrivatePlaylist._id);
    return res.json({ message: "Playlist successfully made private" });
  }
  return res.json({ error: "Internal Server Error" });
});


// for following user
router.post("/follow", fetchuser, [
  body("username", "Enter a valid username").isLength({ min: 3 }),
  async (req, res) => {
    try {
      const userid = req.user.id;
      const tofollow = req.body.username;
      const tofollowuser = await User.findOne({ username: tofollow });
      if (!tofollowuser) {
        return res.status(400).json({ error: "Username not found" });
      }
      const tofusid = tofollowuser.id;
      const user = await User.findById(userid);
      const checkalready = user.following.includes(tofusid);
      if (checkalready) {
        return res.status(400).json({ error: "User already being followed" });
      }
      user.following.push(tofusid);
      await user.save();
      tofollowuser.followers.push(userid);
      await tofollowuser.save();
      res.json({ success: "Following" });
    } catch (error) {
      res.status(500).json({ error: "Error following user" });
    }
  },
]);


// for unfollowing user
router.post("/unfollow", fetchuser, [
  body("username", "Enter a valid username").isLength({ min: 3 }),
  async (req, res) => {
    try {
      const userid = req.user.id;
      const tounfollow = req.body.username;
      const tounfollowuser = await User.findOne({ username: tounfollow });
      if (!tounfollowuser) {
        return res.status(400).json({ error: "Username not found" });
      }
      const toufusid = tounfollowuser.id;
      const user = await User.findById(userid);
      const checkalready = user.following.includes(toufusid);
      if (!checkalready) {
        return res.status(400).json({ error: "User don't follow this user" });
      }
      user.following.pull(toufusid);
      await user.save();
      tounfollowuser.followers.pull(userid);
      await tounfollowuser.save();
      res.json({ success: "unfollowing" });
    } catch (error) {
      res.status(500).json({ error: "Error unfollowing user" });
    }
  },
]);


// for liking track

router.post("/like/:trackId", fetchuser, async (req, res) => {
  const trackID = req.params.trackId;
  try {
    const track = await Track.findById(trackID);
    if (!track) {
      return res.status(400).json({ error: "Track not found" });
    }
    const userid = req.user.id;
    if (track.likes.includes(userid)) {
      return res.status(400).json({ error: "Track already liked" });
    }
    track.likes.push(userid);
    await track.save();
    res.json({ success: "Liked track" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error liking track" });
  }
});


// for unliking track
router.post("/unlike/:trackId", fetchuser, async (req, res) => {
  const trackID = req.params.trackId;
  try {
    const track = await Track.findById(trackID);
    if (!track) {
      return res.status(400).json({ error: "Track not found" });
    }
    const userid = req.user.id;
    const checkalready = track.likes.includes(userid);
    if (!checkalready) {
      return res.status(400).json({ error: "Track not liked" });
    }
    track.likes.pull(userid);
    await track.save();
    res.json({ success: "Unliked track" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error unliking track" });
  }
});

module.exports = router;
