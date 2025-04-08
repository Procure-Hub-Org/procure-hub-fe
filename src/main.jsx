import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import ThemeProviderWrapper from "./context/ThemeContext";
import { CssBaseline } from "@mui/material";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProviderWrapper>
        <CssBaseline />
        <App />
      </ThemeProviderWrapper>
    </BrowserRouter>
  </StrictMode>
);
