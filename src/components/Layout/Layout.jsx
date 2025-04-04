import React from "react";
import Navbar from "../Navbar/Navbar";

const Layout = ({ children }) => {
  return (
    <div style={{ backgroundColor: "#14110F", minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;