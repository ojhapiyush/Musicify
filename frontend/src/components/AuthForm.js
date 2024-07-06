import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./AuthForm.css";
import { updateNavigation, usupdateNavigationeN } from "./navigation";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";

const AuthForm = (props) => {
  const [registerCreds, setRegisterCreds] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  let Navigate = useNavigate();

  const onChangeRegister = (event) => {
    setRegisterCreds({
      ...registerCreds,
      [event.target.name]: event.target.value,
    });
  };

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const onChangeSignin = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };

  const handleSigninSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("https://musicify-v1.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      updateNavigation();
      // console.log(credentials.email);
      Navigate("/profile");
      console.log(localStorage.getItem("userid"));
      props.showAlert("Logged In Successfully", "success");
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    console.log("signup");
    const response = await fetch("https://musicify-v1.onrender.com/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: registerCreds.username,
        email: registerCreds.email,
        password: registerCreds.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      updateNavigation();
      props.showAlert("Created Account Successfully", "success");
      console.log(json);
      Navigate("/profile");
    } else {
      props.showAlert("Error", "danger");
    }
  };

  const [justifyActive, setJustifyActive] = useState("tab1");

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  return (
    <>
      <Navbar />
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
        <h1 style={{ color: "white", textAlign: "center" }}>Musicify</h1>
        <MDBTabs
          pills
          justify
          className="mb-3 d-flex flex-row justify-content-between"
        >
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleJustifyClick("tab1")}
              style={{ backgroundColor: "blue", color: "white" }}
            >
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleJustifyClick("tab2")}
              style={{ backgroundColor: "lightgrey", color: "white" }}
            >
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
          <MDBTabsPane show={justifyActive === "tab1"}>
            <MDBInput
              wrapperClass="mb-4 whitebg"
              label="Email address"
              name="email"
              id="form1"
              type="email"
              onChange={onChangeSignin}
            />
            <MDBInput
              wrapperClass="mb-4 whitebg"
              label="Password"
              name="password"
              id="form2"
              type="password"
              onChange={onChangeSignin}
            />

            <MDBBtn className="mb-4 w-100" onClick={handleSigninSubmit}>
              Sign in
            </MDBBtn>
          </MDBTabsPane>
          <MDBTabsPane show={justifyActive === "tab2"}>
            <MDBInput
              wrapperClass="mb-4 whitebg"
              label="Username"
              id="form1"
              name="username"
              onChange={onChangeRegister}
              type="text"
            />
            <MDBInput
              wrapperClass="mb-4 whitebg"
              name="email"
              label="Email"
              onChange={onChangeRegister}
              id="form1"
              type="email"
            />
            <MDBInput
              wrapperClass="mb-4 whitebg"
              label="Password"
              name="password"
              onChange={onChangeRegister}
              id="form1"
              type="password"
            />
            <MDBInput
              wrapperClass="mb-4 whitebg"
              label="Confirm Password"
              id="form1"
              onChange={onChangeRegister}
              name="confirmpassword"
              type="password"
            />

            <div className="d-flex justify-content-center mb-4">
              <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                label="I have read and agree to the terms"
              />
            </div>

            <MDBBtn className="mb-4 w-100" onClick={handleSignupSubmit}>
              Sign up
            </MDBBtn>
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBContainer>
    </>
  );
};

export default AuthForm;
