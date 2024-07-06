import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "../Profile.css";
import PublicPlaylistsAll from "./PublicPlaylistsAll";

const PublicPlaylists = () => {
  const [pubPlaylists, setPubPlaylists] = useState(null);

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
    fetchPublicPlaylists()
  }, []);

  if (!pubPlaylists) {
    return <div>...Loading</div>;
  }

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ textAlign: "center", color: "white" }}
      >
        <h1>Public Playlists</h1>
      </div>
      <div className="container" style={{ textAlign: "center" }}>
        {pubPlaylists.length === 0 && <h3>No Public Playlists playlists</h3>}
        <PublicPlaylistsAll />
      </div>
    </>
  );
};

export default PublicPlaylists;
