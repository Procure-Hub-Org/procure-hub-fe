import React from "react";
import { Routes, Route } from "react-router-dom";
import PageViewTracker from "./components/PageViewTracker";
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
import AdminProcurementDashboard from "./pages/AdminProcurementRequests.jsx";
import AdminProcurementPreview from "./pages/AdminProcurementPreview.jsx";
import BidLogs from "./pages/BidLogs.jsx";
import BuyerBidEvaluation from "./pages/BuyerBidEvaluation.jsx";
import SellerBidsDashboard from "./pages/SellerBidsDashboard.jsx";
import SellerBidForm from "./pages/SellerBidForm.jsx";
import BidProposalPreview from "./pages/BidProposalPreview.jsx";
import EditBidProposalSeller from "./pages/EditBidProposalSeller.jsx";
import BuyerCreateAuctionForm from "./pages/BuyerCreateAuctionForm.jsx";
import AuctionMonitoringPage from "./pages/AuctionMonitoring.jsx";
import AdminAuctionsDashboard from "./pages/AdminAuctionsDashboard.jsx";
import BuyerAuctionsDashboard from "./pages/BuyerAuctionsDashboard.jsx";
import SellerAuctionsDashboard from "./pages/SellerAuctionsDashboard.jsx";
import BuyerAnalyitics from "./pages/BuyerAnalytics.jsx";
import SellerAnalyitics from "./pages/SellerAnalytics.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import ContractsDashboard from "./pages/ContractsDashboard.jsx";


function App() {
  return (
    <PageViewTracker>
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
          path="/new-auction"
          element={
            <AuthenticatedRoute>
              <BuyerCreateAuctionForm />
            </AuthenticatedRoute>
          }
        />

        <Route
          path="/new-request"
          element={
            <AuthenticatedRoute>
              <BuyerProcurementForm />
            </AuthenticatedRoute>
          }
        />

        <Route
          path="/buyer-request/:id"
          element={
            <AuthenticatedRoute>
              <ProcurementPreview />
            </AuthenticatedRoute>
          }
        />

        <Route
          path="/edit-request/:id"
          element={
            <AuthenticatedRoute>
              <EditProcurementForm />
            </AuthenticatedRoute>
          }
        />

        <Route
          path="/buyer-auctions"
          element={
            <AuthenticatedRoute>
              <BuyerAuctionsDashboard />
            </AuthenticatedRoute>
          }
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
        <Route
          path="/seller-auctions"
          element={
            <AuthenticatedRoute>
              <SellerAuctionsDashboard />
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
          path="/admin-procurement-requests"
          element={
            <AdminRoute>
              <AdminProcurementDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-procurement-requests/:id"
          element={
            <AdminRoute>
              <AdminProcurementPreview />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-procurement-requests/:requestId/bid/:bidId"
          element={
            <AdminRoute>
              <BidLogs />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-auctions"
          element={
            <AdminRoute>
              <AdminAuctionsDashboard />
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
          path="/buyer/procurement/:id/bids"
          element={
            <AuthenticatedRoute>
              <BuyerBidEvaluation />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/new-bid/:requestId"
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
        <Route
          path="/auction-monitoring/:id"
          element={
            <AuthenticatedRoute>
              <AuctionMonitoringPage />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/buyer-analytics"
          element={
            <AuthenticatedRoute>
              <BuyerAnalyitics />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/seller-analytics"
          element={
            <AuthenticatedRoute>
              <SellerAnalyitics />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/admin-analytics"
          element={
            <AuthenticatedRoute>
                <AdminAnalytics />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/contract-dashboard"
          element={
            <AuthenticatedRoute>
                <ContractsDashboard />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </PageViewTracker>
  );
}

export default App;
