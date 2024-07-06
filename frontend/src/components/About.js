import React from "react";
import Navbar from "./Navbar";
import "./About.css";
const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <img
              className="about-image"
              src="https://www.freepnglogos.com/uploads/music-png-17.png"
              alt="Musicify Logo"
            />
          </div>
          <div className="col-md-6">
            <h2 style={{color:"white", textAlign:"center"}}>About Musicify</h2>
            <p>
              Musicify is a platform for sharing music. Our mission is to
              connect music lovers around the world and enable them to discover
              new music, create playlists, and share their favorite songs with
              friends and family.
            </p>
            <p>
              With Musicify, you can easily browse millions of songs from your
              favorite artists, create custom playlists, and share them with
              anyone you like. Whether you're a casual listener or a die-hard
              music fan, Musicify has something for everyone.
            </p>
            <p>
              Join us today and start sharing your love of music with the world!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
