import React, { useContext, useEffect, useState } from "react";
import TrackItem from "./TrackItem";
import "./Tracks.css";

const PubTracks = (props) => {
  const { playlistid } = props;
  const [tracks, setTracks] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTracks, setFilteredTracks] = useState([]);

  const fetchPubTracks = async () => {
    try {
      const response = await fetch(
        `https://musicify-v1.onrender.com/api/auth/getPublicTracks/${playlistid}`
      );
      const json = await response.json();
      console.log(json.tracks); // added for debugging
      setTracks(json.tracks);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrackDetails = async (id1) => {
    try {
      const response = await fetch(
        `https://musicify-v1.onrender.com/api/auth/getPublicttrack/${id1}`,
        {
          method: "GET",
        }
      );
      const { name, artist, genre } = await response.json();
      return { id: id1, name, artist, genre }; // include the track ID in the returned object
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPubTracks();
  }, [playlistid]);

  if (!tracks) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="tracks">
        {tracks.map((trackid) => (
          <TrackItem key={trackid} id={trackid} />
        ))}
      </div>
    </>
  );
};

export default PubTracks;
