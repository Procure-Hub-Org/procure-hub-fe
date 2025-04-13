import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";
import BuyerDashboardRequests from "./pages/BuyerDashboardRequests";
import SellerDashboardRequests from "./pages/SellerDashboardRequests.jsx";
import PreviewComponent from "./components/PreviewComponent";
import AdminDashboard from "./pages/AdminDashboard";
import CreateUserPage from "./pages/CreateUserPage";
import AuthenticatedRoute from "./components/Middleware/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/Middleware/UnauthenticatedRoute";
import AdminRoute from "./components/Middleware/AdminRoute";
import BuyerProcurementForm from "./pages/BuyerProcurementForm.jsx";
import SellerFavorites from "./pages/SellerFavorites.jsx";

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
      <Route
        path="/buyer-procurement-requests"
        element={
          <AuthenticatedRoute>
            <BuyerDashboardRequests />
          </AuthenticatedRoute>
        }
      />

      <Route 
        path="/new-request" 
        element={
        <AuthenticatedRoute>
          <BuyerProcurementForm />
        </AuthenticatedRoute>} 
      />

      <Route
        path="/seller-procurement-requests"
        element={
          <AuthenticatedRoute>
            <SellerDashboardRequests />
          </AuthenticatedRoute>
        }
      />
      <Route 
        path="/seller-favorites"
        element={
          <AuthenticatedRoute>
            <SellerFavorites />
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
    </Routes>
  );
}

export default App;
