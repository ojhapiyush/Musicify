import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PublicPlaylistItem = (props) => {
  const { id } = props;
  const { ownerid } = props;
  //   console.log("2");
  //   console.log(typeof ownerid);
  const [pubplaylist, setPubplaylist] = useState({});

  const [owner, setOwner] = useState({});
  const fetchowner = async () => {
    try {
      const response = await fetch(
        `https://musicify-v1.onrender.com/api/auth/getOwner/${ownerid}`
      );
      const json = await response.json();
      setOwner(json);
      //   console.log(json);
      //   console.log(ownerid);
    } catch (error) {
      console.log(error);
    }
  };
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
    fetchowner();
  }, [id]);
  //   useEffect(() => {
  //   }, []);

  if (!pubplaylist) {
    return <div>...Loading</div>;
  }

  if (!owner) {
    return <div>...Loading</div>;
  }
  console.log(owner);

  return (
    <>
      <div
        className="card"
        style={{
          width: "18rem",
          margin: "10px auto",
          backgroundColor: "#f2f2f2",
        }}
      >
        <div className="card-body">
          <h5 className="card-title">{pubplaylist.name}</h5>
          <p className="card-text">{pubplaylist.description}</p>
          <p
            className="card-text"
            style={{ fontWeight: "bold", textShadow: "0px 0px 5px black" }}
          >
            Created By:
            <br />
            {owner.username}
          </p>
          <Link
            to={`/viewPublicPlaylist/${id}`}
            className="btn btn-primary"
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
          >
            View Playlist
          </Link>
        </div>
      </div>
    </>
  );
};

export default PublicPlaylistItem;
