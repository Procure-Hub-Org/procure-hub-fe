import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";
import PreviewComponent from "./components/PreviewComponent";
import AdminDashboard from "./pages/AdminDashboard";
import CreateUserPage from "./pages/CreateUserPage";
import AuthenticatedRoute from "./components/Middleware/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/Middleware/UnauthenticatedRoute";
import AdminRoute from "./components/Middleware/AdminRoute";
import SellerDashboard from "./pages/SellerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <UnauthenticatedRoute>
            <RegisterPage />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthenticatedRoute>
            <UserProfile />
          </AuthenticatedRoute>
        }
      />
      <Route path="/preview" element={<PreviewComponent />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/create-user"
        element={
          <AdminRoute>
            <CreateUserPage />
          </AdminRoute>
        }
      />
      <Route
        path="/SD"
        element={
          <UnauthenticatedRoute>
            <SellerDashboard />
          </UnauthenticatedRoute>
        }
      />
    </Routes>
  );
}

export default App;
