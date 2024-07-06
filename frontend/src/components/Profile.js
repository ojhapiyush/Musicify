import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import ProfilePic from "./ProfilePic";
import "./Profile.css";
import userContext from "../context/userContext";

const Profile = (props) => {
  const userDetails = useContext(userContext);

  useEffect(() => {
    userDetails.getUserDetails();
  }, []);

  if (!userDetails.state2.email) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div
        className="container1"
        style={{ textAlign: "center", color: "white" }}
      >
        <ProfilePic />
        <h1>{userDetails.state2.username}</h1>
        <h4>{userDetails.state2.email}</h4>

        <p>Playlists: {userDetails.state2.playlists.length}</p>
        <p>Followers: {userDetails.state2.followers.length}</p>
        <p>Following: {userDetails.state2.following.length}</p>
      </div>
    </>
  );
};

export default Profile;
