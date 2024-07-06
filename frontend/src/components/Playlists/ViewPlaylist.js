import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/fontawesome-free-solid";
import axios from "axios";
import { FaSpinner, FaCheck } from "react-icons/fa";
import Tracks from "./Tracks";

const ViewPlaylist = (props) => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState({});

  const [trackData, setTrackData] = useState({
    tname: "",
    artist: "",
    albumart: "",
    genre: "",
    file_url: "",
  });

  const [uploadedSRC, setUploadedSRC] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const uploadFile = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ov4ty1q2");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/drxdqo1xr/upload",
        formData
      );
      const uploadedFile = response.data.secure_url;
      setUploadedSRC(uploadedFile);
      setFile(null);
      setTrackData((prevState) => ({ ...prevState, file_url: uploadedFile }));
      setIsUploaded(true);
      console.log("uploaded");
      console.log(uploadedFile);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewTrack = async (event) => {
    event.preventDefault();
    console.log(`https://musicify-v1.onrender.com/api/auth/addTrackToPlaylist/${id}`);
    const response = await fetch(
      `https://musicify-v1.onrender.com/api/auth/addTrackToPlaylist/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: trackData.tname,
          artist: trackData.artist,
          albumArt: trackData.albumart,
          genre: trackData.genre,
          file_url: trackData.file_url,
        }),
      }
    );
    const json = await response.json();
    console.log(json);
    // handleShowModal();
    if (json.success) {
      props.showAlert("Added Track Successfully to Playlist", "success");
      handleShowModal();
      window.location.reload();
    } else {
      console.log(json);
      props.showAlert("Error while adding track", "danger");
    }
  };

  const onAddNewTrackChange = (event) => {
    event.preventDefault();
    setTrackData({ ...trackData, [event.target.name]: event.target.value });
  };

  const onChangeFile = (event) => {
    event.preventDefault();
    console.log("changeFile");
    const file = event.target.files[0];
    setFile(file);
    setIsUploaded(false);
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

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (event) => {
    event.preventDefault();
    showModal ? setShowModal(false) : setShowModal(true);
  };

  if (!playlist.tracks) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ textAlign: "center", color: "white" }}
      >
        <h1>{playlist.name}</h1>
        <p>{playlist.description}</p>
      </div>
      <div
        className="container"
        style={{ textAlign: "center", color: "white" }}
      >
        {playlist.tracks.length === 0 && (
          <h3>You have no tracks in playlist</h3>
        )}
      </div>
      <Tracks playlistid={id} />
      <button
        className="plus-button"
        style={{
          textAlign: "center",
          color: "white",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          position: "fixed",
          top: "20px",
          right: "20px",
          height: "60px",
          width: "60px",
          borderRadius: "50%",
          backgroundColor: "purple",
          zIndex: "9999",
        }}
        onClick={handleShowModal}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {{ showModal } && (
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add New Track
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleShowModal}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">
                      Track Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="tname"
                      id="tname"
                      onChange={onAddNewTrackChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">
                      Artist
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="artist"
                      id="artist"
                      onChange={onAddNewTrackChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">
                      Album Art Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="albumart"
                      id="albumart"
                      onChange={onAddNewTrackChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">
                      Genre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="genre"
                      id="genre"
                      onChange={onAddNewTrackChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      Audio File
                    </label>
                    <input
                      className="form-control"
                      onChange={onChangeFile}
                      type="file"
                      id="formFile"
                    />
                    {file && (
                      <div className="mt-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={uploadFile}
                          disabled={isLoading || isUploaded}
                        >
                          {isLoading
                            ? "Uploading..."
                            : isUploaded
                            ? "Uploaded"
                            : "Upload"}
                          {isLoading && <FaSpinner className="me-2" />}
                        </button>
                      </div>
                    )}
                    {isUploaded && (
                      <div className="container">
                        <FaCheck className="me-2" />
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleShowModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateNewTrack}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewPlaylist;
