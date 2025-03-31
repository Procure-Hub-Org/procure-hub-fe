import React from "react";
import "../styles/ComingSoon.css";
import logo from "../assets/procure-hub.png";

function ComingSoon() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 vw-100 secondary-color text-center">
      <h1 className="display-4 primary-color fw-bold mb-4">Coming Soon</h1>
      <img src={logo} alt="ProcureHub Logo" className="img-fluid" style={{ maxWidth: "200px" }} />
    </div>
  );
}

export default ComingSoon;