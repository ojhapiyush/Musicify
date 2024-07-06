import React, { useContext, useEffect, useState } from "react";
import TrackItem from "./TrackItem";
import "./Tracks.css";

const Tracks = (props) => {
  const { playlistid } = props;
  const [tracks, setTracks] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTracks, setFilteredTracks] = useState([]); // create a new state for filtered tracks and initialize it to an empty array

  const fetchTracks = async () => {
    try {
      const response = await fetch(
        `https://musicify-v1.onrender.com/api/auth/getTracks/${playlistid}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const json = await response.json();
      setTracks(json.tracks);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrackDetails = async (id1) => {
    try {
      const response = await fetch(
        `https://musicify-v1.onrender.com/api/auth/gettrack/${id1}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const { name, artist, genre } = await response.json();
      return { name, artist, genre }; // return the fetched track details
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [playlistid]);

  useEffect(() => {
    // filter the tracks when the search query or tracks state changes
    const filterTracks = async () => {
      if (tracks) {
        // check if the tracks are not null
        const filtered = await Promise.all(
          tracks.map(async (track) => {
            const trackDetails = await fetchTrackDetails(track); // fetch the details for each track
            console.log(trackDetails);
            // check if any of the track details values include the search query
            return Object.values(trackDetails).some(
              (value) =>
                value && value.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
        );
        setFilteredTracks(filtered);
      }
    };
    filterTracks();
  }, [tracks, searchQuery]);

  if (!tracks) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container" style={{ textAlign: "center" }}>
        <input
          type="text"
          id="search"
          placeholder="Seach Keywords"
          name="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {tracks
        .filter((_, index) => filteredTracks[index]) // filter the tracks based on the filteredTracks state
        .map((trackid) => (
          <TrackItem key={trackid} id={trackid} />
        ))}
    </div>
  );
};

export default Tracks;
