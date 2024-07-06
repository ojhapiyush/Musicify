import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { useState } from "react";
import { useEffect } from "react";
import PubTracks from "./PubTracks";

const ViewPublicPlaylists = (props) => {
  const { id } = useParams();
  const [pubplaylist, setPubplaylist] = useState({});
  const [trackData, setTrackData] = useState({
    tname: "",
    artist: "",
    albumart: "",
    genre: "",
    file_url: "",
  });
  const fetchPublicPlaylists = async () => {
    try {
      const response = await fetch(
        `https://musicify-v1.onrender.com/api/auth/getPublicPlaylist/${id}`
      );
      const json = await response.json();
      console.log(json);
      setPubplaylist(json);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPublicPlaylists();
  }, [id]);

  if (!pubplaylist.tracks) {
    return <div>...Loading</div>;
  }
  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ textAlign: "center", color: "white" }}
      >
        <h1>{pubplaylist.name}</h1>
        <p>{pubplaylist.description}</p>
      </div>
      <div
        className="container"
        style={{ textAlign: "center", color: "white" }}
      >
        {pubplaylist.tracks.length === 0 && (
          <h3>This Playlist has no Tracks</h3>
        )}
      </div>
      <PubTracks playlistid={pubplaylist._id} />
    </>
  );
};

export default ViewPublicPlaylists;
