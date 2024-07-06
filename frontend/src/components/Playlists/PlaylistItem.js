import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PlaylistItem.css";

const PlaylistItem = (props) => {
  const { id } = props;
  const [playlist, setPlaylist] = useState({});

  const [status, setStatus] = useState(null);
  const [iconLink, setIconLink] = useState("fa-lock");

  const getPrivateStatus = async (id1) => {
    try {
      const response = await fetch(
        `https://musicify-v1.onrender.com/api/auth/getpvtStatus/${id1}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const json = await response.json();
      setStatus(json.success);
      setIconLink(json.success ? "fa-earth-asia" : "fa-lock");
    } catch (error) {
      console.error(error);
      setStatus(null);
    }
  };
  useEffect(() => {
    getPrivateStatus(id);
  }, []);

  const makePlaylistPublic = async (id1) => {
    const response = await fetch(
      `https://musicify-v1.onrender.com/api/auth/public/${id1}`,
      {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    console.log(json, "made public");
  };

  const makePlaylistPrivate = async (id1) => {
    const response = await fetch(
      `https://musicify-v1.onrender.com/api/auth/private/${id1}`,
      {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    console.log(json, "made private");
  };

  const handleIconLinkchange = (idtemp) => {
    // event.preventDefault();
    if (iconLink === "fa-lock") {
      setIconLink("fa-earth-asia");
      makePlaylistPublic(idtemp);
    } else {
      setIconLink("fa-lock");
      makePlaylistPrivate(idtemp);
    }
  };

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const response = await fetch(
          `https://musicify-v1.onrender.com/api/auth/getplaylist/${id}`,
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        const json = await response.json();
        setPlaylist(json);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  return (
    <div className="card" style={{ width: "18rem", margin: "10px auto" }}>
      <div className="card-body">
        <div className="card-icon-container">
          <i
            className={`fa-solid ${iconLink}`}
            onClick={(e) => {
              e.preventDefault();
              handleIconLinkchange(playlist._id);
            }}
          ></i>
        </div>
        <h5 className="card-title">{playlist.name}</h5>
        <p className="card-text">{playlist.description}</p>
        <Link to={`/viewplaylist/${id}`} className="btn btn-primary">
          View Playlist
        </Link>
      </div>
    </div>
  );
};

export default PlaylistItem;
