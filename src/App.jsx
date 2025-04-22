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
import ProcurementPreview from "./pages/ProcurementPreview.jsx";
import SellerFavorites from "./pages/SellerFavorites.jsx";
import EditProcurementForm from "./pages/EditProcurementRequestBuyer.jsx";
import SellerBidsDashboard from "./pages/SellerBidsDashboard.jsx";
import SellerBidForm from "./pages/SellerBidForm.jsx";
import BidProposalPreview from "./pages/BidProposalPreview.jsx";
import EditBidProposalSeller from "./pages/EditBidProposalSeller.jsx";
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
        path="/buyer-request/:id" 
        element={
        <AuthenticatedRoute>
          <ProcurementPreview />
        </AuthenticatedRoute>} 
      />

      <Route 
        path="/edit-request/:id" 
        element={
        <AuthenticatedRoute>
          <EditProcurementForm />
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
      <Route 
        path="/seller-bids"
        element={
          <AuthenticatedRoute>
            <SellerBidsDashboard />
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
        path="/new-bid"
        element={
          <AuthenticatedRoute>
          <SellerBidForm />
        </AuthenticatedRoute>
        }
      />
      <Route
        path="/preview-bid/:id"
        element={
          <AuthenticatedRoute>
          <BidProposalPreview />
        </AuthenticatedRoute>
        }
      />
      <Route
        path="/edit-bid/:id"
        element={
          <AuthenticatedRoute>
          <EditBidProposalSeller />
        </AuthenticatedRoute>
        }
      />
    </Routes>
  );
}

export default App;
