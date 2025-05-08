import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isSeller } from "../utils/auth.jsx";
import SellerBidCard from "../components/Cards/SellerBidCard.jsx";
import Layout from "../components/Layout/Layout.jsx";

const SellerBidsDashboard = () => {
  const token = localStorage.getItem("token");
  const sellerId = localStorage.getItem("id");
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!isAuthenticated() || !isSeller()) {
    return <Navigate to="/login" replace />;
  }
  if (!sellerId) {
    console.error("Seller ID not found");
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bids/user/${sellerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBids(res.data);
      } catch (err) {
        console.error("Error fetching bids:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [sellerId, token]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="seller-favorites-container">
        <h3>Seller Dashboard - Bid Proposals</h3>
        <div className="requests-list-section">
          <div className="scrollable-list-container">
            {bids.length > 0 ? (
              <div>
                {bids.map((bid) => (
                  <SellerBidCard key={bid.id} bid={bid} />
                ))}
              </div>
            ) : (
              <p>No bids available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerBidsDashboard;
