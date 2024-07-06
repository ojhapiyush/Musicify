import React from "react";
import { useState } from "react";
const ProfilePic = () => {
  const [hovered, setHovered] = useState(false);
  const [opacity, setOpacity] = useState(1);
  return (
    <div
      className="container my-3"
      style={{
        color: "white",
        justifyContent: "center",
        display: "flex",
        height: "200px",
      }}
    >
      <div>
        <img
          style={{
            borderRadius: "50%",
            opacity: opacity,
            cursor: "pointer",
            width: "200px",
            height: "200px",
          }}
          alt=""
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          // onClick={submitUploadedFile}
          onMouseEnter={() => {
            setHovered(true);
            setOpacity(0.7);
          }}
          onMouseLeave={() => {
            setHovered(false);
            setOpacity(1);
          }}
          title="Change Profile Image"
        />
        {hovered && (
          <i
            style={{
              fontSize: "20px",
              color: "gray",
              position: "absolute",
              top: "25%",
              left: "49.40%",
            }}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            className="fa-solid fa-square-pen"
            // onClick={submitUploadedFile}
            title="Change Profile Image"
            onMouseEnter={() => {
              setHovered(true);
              setOpacity(0.7);
            }}
            onMouseLeave={() => {
              setHovered(false);
              setOpacity(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePic;
