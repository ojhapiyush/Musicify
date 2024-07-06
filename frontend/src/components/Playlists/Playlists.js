import React, { useContext, useEffect, useState } from "react";
import userContext from "../../context/userContext";
import PlaylistItem from "./PlaylistItem";
import "./Playlists.css";

const Playlists = (props) => {
  const userDetails = useContext(userContext);
  const [playlists, setPlaylists] = useState(userDetails.state2.playlists);

  useEffect(() => {
    setPlaylists(userDetails.state2.playlists);
  }, [userDetails.state2.playlists]);

  let playListArray = playlists;
  if (typeof playlists === "string") {
    playListArray = playlists.split(",");
  }

  if (!playlists) {
    return <div>Loading...</div>;
  }

  return (
    <div className="playlist-container" >
      {playListArray.map((playlistId) => (
        <PlaylistItem className="my-2 mx-2" key={playlistId} id={playlistId} />
      ))}
    </div>
  );
};

export default Playlists;
