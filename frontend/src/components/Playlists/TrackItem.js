import { useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaRedoAlt,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
const TrackItem = ({ id }) => {
  const [idToDelete, setIdToDelete] = useState(null);
  const [track, setTrack] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [audio] = useState(new Audio(track.file_url));

  const onPlayPauseClick = () => {
    setIsPlaying(!isPlaying);
    if (!isPlayerOpen) {
      setIsPlayerOpen(true);
    }
  };

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const onTimeUpdate = () => {
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
  };

  useEffect(() => {
    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  const progressBarWidth = `${(currentTime / duration) * 100}%`;

  const [deleted, setDeleted] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (id) => {
    setShowModal(true);
    setIdToDelete(id);
  };
  useEffect(() => {
    console.log(idToDelete);
  }, [idToDelete]);

  const fetchTrackDetails = async () => {
    try {
      const response = await fetch(
        `https://musicify-v1.onrender.com/api/auth/gettrack/${id}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const json = await response.json();
      setTrack(json);
      audio.src = json.file_url;
      audio.load(); // Add this line
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTrackDetails();
  }, [id]);

  const handleDelete = async (id1) => {
    console.log(id1);
    const response = await fetch(
      `https://musicify-v1.onrender.com/api/auth/deleteFile/${id1}`,
      {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    console.log(json);
    setDeleted(true);
    setIsPlayerOpen(false);
    setShowModal(false);
    window.location.reload();
  };

  const onEnded = () => {
    togglePlayer();
    setIsPlaying(false);
  };

  useEffect(() => {
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlayer = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
    setIsPlayerOpen(!isPlayerOpen);
  };

  return (
    <>
      {!deleted && (
        <div className="track-item">
          <div className="image-container">
            <img src={track.albumArt} alt={track.name} />
          </div>
          <div className="track-details">
            <div className="track-info">
              <div className="track-name">{track.name}</div>
              <div className="track-artist">{track.artist}</div>
              <div className="track-genre">{track.genre}</div>
            </div>
            <div className="track-controls">
              {isPlaying ? (
                <FaPause className="play-pause" onClick={onPlayPauseClick} />
              ) : (
                <FaPlay className="play-pause" onClick={onPlayPauseClick} />
              )}
            </div>
            <div>
              {
                <FaTrashAlt
                  onClick={(e) => {
                    e.preventDefault();
                    handleShowModal(track._id);
                    console.log(track._id);
                  }}
                  style={{ margin: "20px" }}
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                />
              }
            </div>
          </div>
        </div>
      )}
      {isPlayerOpen && (
        <div className="music-player">
          <div className="music-player-details">
            <div className="music-player-title">{track.name}</div>
            <div className="music-player-buttons">
              <div className="music-player-play-pause">
                {isPlaying ? (
                  <FaPause className="play-pause" onClick={onPlayPauseClick} />
                ) : (
                  <FaPlay className="play-pause" onClick={onPlayPauseClick} />
                )}
              </div>
              <div>
                <FaRedoAlt
                  className="restart-button"
                  onClick={() => {
                    audio.currentTime = 0;
                    setCurrentTime(0);
                  }}
                />
              </div>
              <div>
                <FaTimes className="close-button" onClick={togglePlayer} />
              </div>
            </div>
            <div className="music-player-artist">{track.artist}</div>
          </div>
          <div className="music-player-controls">
            {duration > 0 && (
              <div className="music-player-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${progressBarWidth}`,
                    backgroundColor: "yellow",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="modal fade"
          id="deleteModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Track</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p style={{ color: "black" }}>
                  Track will be deleted from the database.
                </p>
                <p style={{ color: "black" }}>This action can't be reverted.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(track._id);
                    handleDelete(track._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrackItem;
