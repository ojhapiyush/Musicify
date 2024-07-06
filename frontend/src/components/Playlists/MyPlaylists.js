import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import "../Profile.css";
import userContext from "../../context/userContext";
import Playlists from "./Playlists";

const MyPlaylists = (props) => {
  const userDetails = useContext(userContext);

  const [showModal, setShowModal] = useState(false);
  const [newPlaylistDetails, setNewPlaylistDetails] = useState({
    pname: "",
    description: "",
  });

  const onChangeNewPlaylist = (event) => {
    setNewPlaylistDetails({
      ...newPlaylistDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateNewPlaylist = async (event) => {
    event.preventDefault();
    const response = await fetch(
      "https://musicify-v1.onrender.com/api/auth/createPlaylist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: newPlaylistDetails.pname,
          desc: newPlaylistDetails.description,
        }),
      }
    );
    const json = await response.json();
    if (json.success) {
      props.showAlert("Playlist Created Successfully", "success");
      handleShowModal();
    } else {
      console.log(json);
      props.showAlert("Error while creating Playlist", "danger");
    }
  };

  useEffect(() => {
    userDetails.getUserDetails();
  }, []);

  if (!userDetails.state2.email && !userDetails.state2.playlists) {
    return <div>Loading...</div>;
  }

  const handleShowModal = (event) => {
    event.preventDefault();
    showModal ? setShowModal(false) : setShowModal(true);
  };

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ textAlign: "center", color: "white" }}
      >
        <h1>Your Playlists</h1>
      </div>
      <div className="container" style={{ textAlign: "center" }}>
        {userDetails.state2.playlists.length === 0 && (
          <h3>You have no playlists</h3>
        )}
      </div>
      <Playlists />
      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary my-2"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Create New Playlist
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
                    Create New Playlist
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
                        PlayList Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="pname"
                        id="pname"
                        onChange={onChangeNewPlaylist}
                      />
                    </div>
                    <div className="mb-3">
                      <label for="exampleInputPassword1" className="form-label">
                        Description
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="description"
                        id="description"
                        onChange={onChangeNewPlaylist}
                        style={{ height: "100px" }}
                      />
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
                    onClick={handleCreateNewPlaylist}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyPlaylists;
