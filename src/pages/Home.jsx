import React from "react";
import "../styles/Home.css";
import logo from "../assets/procure-hub.png";

function Home() {
  return (
    <div className="home">
      <h1>Welcome to ProcureHub</h1>
      <img src={logo} alt="ProcureHub Logo" className="logo" />
    </div>
  );
}

export default Home;

