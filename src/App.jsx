import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import PreviewComponent from "./components/PreviewComponent";
import Login from "./pages/Login";
import ComingSoon from "./pages/ComingSoon";





function App() {
  return (
    /* <Layout>
      <Home />
    </Layout>*/

    //<PreviewComponent></PreviewComponent>
    //<ComingSoon></ComingSoon>
      <Router>
          <Routes>
              <Route path="/" element={<ComingSoon />} />
              <Route path="/login" element={<Login />} />
              <Route path="/previewComponent" element={<PreviewComponent />} />
              <Route path="/home" element={<Home />} />
          </Routes>
      </Router>
  );
}

export default App;
