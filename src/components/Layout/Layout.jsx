import React from "react";
import Navbar from "../Navbar/Navbar";
import { Container } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <div style={{ backgroundColor: "#14110F", minHeight: "100vh", color: "#E3B34B" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ paddingTop: "20px", color: "#E3B34B" }}>
        {children}
      </Container>
    </div>
  );
};

export default Layout;

