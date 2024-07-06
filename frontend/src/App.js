import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Alert from "./components/Alert";
import AuthForm from "./components/AuthForm";
import Profile from "./components/Profile";
import UserState from "./context/UserState";
import MyPlaylists from "./components/Playlists/MyPlaylists";
import ViewPlaylist from "./components/Playlists/ViewPlaylist";
import PublicPlaylists from "./components/PublicItems/PublicPlaylists";
import About from "./components/About";
import ViewPublicPlaylists from "./components/PublicItems/ViewPublicPlaylists";

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <>
      <UserState>
        <BrowserRouter>
          <Alert alert={alert} />
          <Routes>
            <Route
              path="/"
              element={<AuthForm showAlert={showAlert} />}
            ></Route>

            <Route
              path="/profile"
              element={<Profile showAlert={showAlert} />}
            ></Route>
            <Route
              path="/MyPlaylists"
              element={<MyPlaylists showAlert={showAlert} />}
            ></Route>
            <Route
              path="/PublicPlaylists"
              element={<PublicPlaylists showAlert={showAlert} />}
            ></Route>
            <Route
              exact
              path="/viewPlayList/:id"
              element={<ViewPlaylist showAlert={showAlert} />}
            ></Route>
            <Route
              exact
              path="viewPublicPlaylist/:id"
              element={<ViewPublicPlaylists showAlert={showAlert} />}
            ></Route>
            <Route
              exact
              path="/About"
              element={<About showAlert={showAlert} />}
            ></Route>
          </Routes>
        </BrowserRouter>
      </UserState>
    </>
  );
}

export default App;
