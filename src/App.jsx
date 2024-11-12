import React from "react";
import DownloadList from "./components/DownloadList.jsx";
import { useState } from "react";
import logo from "./assets/wpLogo.svg";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div onClick={() => window.location.reload()} className="header">
        <img src={logo} alt="reload image" className="logo" />
      </div>

      <DownloadList />
    </div>
  );
};

export default App;
