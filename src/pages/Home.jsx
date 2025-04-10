import React from "react";
import "../styles/Home.css";
import logo from "/procure-hub-logo/svg/logo-no-background.svg";
import Navbar from "../components/Navbar/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <div className="home">
        <img src={logo} alt="ProcureHub Logo" className="logo" viewBox="0 0 200 200"/>
      </div>
    </>
  );
}

export default Home;
