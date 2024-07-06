import React, { useContext, useEffect, useState } from "react";
import userContext from "../../context/userContext";
import "./Playlists.css";
import PublicPlaylistItem from "./PublicPlaylistItem";

const PublicPlaylistsAll = (props) => {
  const userDetails = useContext(userContext);
  const [pubPlaylists, setPubPlaylists] = useState([]);

  const fetchPublicPlaylists = async () => {
    try {
      const response = await fetch(
        `https://musicify-v1.onrender.com/api/auth/getPublicPlaylists`
      );
      const json = await response.json();
      setPubPlaylists(json);
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPublicPlaylists();
    // console.log("pubarray");
    console.log(pubPlaylists);
  }, []);

  let playListArray = [...pubPlaylists];

  if (!pubPlaylists) {
    return <div>Loading...</div>;
  }

  return (
    <div className="playlist-container">
      {pubPlaylists.map((playlist) => (
        <PublicPlaylistItem
          className="my-2 mx-2"
          key={playlist._id}
          id={playlist._id}
          ownerid={playlist.ownerId}
        />
      ))}
    </div>
  );
};

export default PublicPlaylistsAll;
