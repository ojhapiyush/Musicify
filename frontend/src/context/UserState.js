import React from "react";
import { useState } from "react";
import UserContext from "./userContext";

const UserState = (props) => {
  const host = "https://musicify-v1.onrender.com";
  const state = {
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    playlists: localStorage.getItem("playlists"),
    followers: localStorage.getItem("followers"),
    following: localStorage.getItem("following"),
  };
  const [state2, setState2] = useState(state);
  const update = (email, username, playlists, followers, following) => {
    setState2({
      username: username,
      email: email,
      playlists: playlists,
      followers: followers,
      following: following,
    });
  };



  const getUserDetails = async () => {
    try {
      const response = await fetch(`${host}/api/auth/getuser`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      console.log(json);
      update(
        json.email,
        json.username,
        json.playlists,
        json.followers,
        json.following
      );
      localStorage.setItem("username", json.username);
      localStorage.setItem("email", json.email);
      localStorage.setItem("playlists", json.playlists);
      localStorage.setItem("followers", json.followers);
      localStorage.setItem("following", json.following);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <UserContext.Provider value={{ state2, update, getUserDetails }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
