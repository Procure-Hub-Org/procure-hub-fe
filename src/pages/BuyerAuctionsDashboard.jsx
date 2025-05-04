import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import PrimaryButton from "../components/Button/PrimaryButton";
import "../styles/Admin.css";
import { isAuthenticated, isAdmin } from "../utils/auth.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import "../styles/AuctionsDashboard.css";

const BuyerAuctionsDashboard = () => {
  const theme = useTheme();
  const [openAuctions, setOpenAuctions] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [closedAuctions, setClosedAuctions] = useState([]);
  const navigate = useNavigate();

  const sortOpenAuctions = (auctions) => {
    return auctions.sort(
      (a, b) => new Date(a.startingTime) - new Date(b.startingTime)
    );
  };

  // Sort active auctions by soonest ending time
  const sortActiveAuctions = (auctions) => {
    return auctions.sort(
      (a, b) => new Date(a.endingTime) - new Date(b.endingTime)
    );
  };

  // Sort closed auctions by most recently ended
  const sortClosedAuctions = (auctions) => {
    return auctions.sort(
      (a, b) => new Date(b.endingTime) - new Date(a.endingTime)
    );
  };

  useEffect(() => {
    const fetchAuctionsData = async () => {
      console.log("fetcha");
      // setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auctions-dashboard`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resData = await response.json();
        console.log("zavrsio fetch:");
        console.log(resData);

        const open = [];
        const active = [];
        const closed = [];

        for (const item of resData) {
          let auction = {
            id: item.id,
            buyerEmail: item.procurementRequest.buyer.email,
            requestTitle: item.procurementRequest.title,
            startingTime: item.starting_time,
            endingTime: item.ending_time,
            duration: item.duration,
            minIncrement: item.min_increment,
            lastCallTimer: item.last_call_timer,
            status: item.status,
          };
          if (item.winningBid) {
            auction = {
              ...auction,
              winningBid: item.winningBid.auction_price,
              winningSeller: {
                companyName: item.winningBid.sellerCompany,
                name: item.winningBid.sellerName,
              },
            };
          }
          if (auction.status === "to_be") open.push(auction);
          else if (auction.status === "active") active.push(auction);
          else if (auction.status === "happened") closed.push(auction);
        }

        setOpenAuctions(sortOpenAuctions(open));
        setActiveAuctions(sortActiveAuctions(active));
        setClosedAuctions(sortClosedAuctions(closed));
      } catch (error) {
        console.error("Failed to fetch auctions data:", error);
      } finally {
        // setIsLoading(false);
        console.log("NE fetcha");
      }
    };
    fetchAuctionsData();
  }, []);
  
  const renderAuctionCard = (auction, hasWinner, columnType) => (
    <div
      className="auction-card"
      key={auction.id}
      style={{ backgroundColor: theme.palette.background.paper }}
    >
      <div style={{ width: "100%" }}>
        <p>
          <strong>Buyer:</strong> {auction.buyerEmail}
        </p>
        <p>
          <strong>Request:</strong> {auction.requestTitle}
        </p>
      </div>
      <p>
        <strong>Start:</strong>{" "}
        {new Date(auction.startingTime).toLocaleString()}
      </p>
      <p>
        <strong>Duration:</strong> {auction.duration} min
      </p>
      <p>
        <strong>Min Increment:</strong> {auction.minIncrement}
      </p>
      <p>
        <strong>Last Call:</strong> {auction.lastCallTimer} min
      </p>
      {hasWinner && auction.winningBid && auction.winningSeller && (
        <>
          <p>
            <strong>Winning Bid:</strong> {auction.winningBid}
          </p>
          <p>
            <strong>Winner:</strong> {auction.winningSeller.name} (
            {auction.winningSeller.companyName})
          </p>
        </>
      )}

      {/* Monitor button for active auctions */}
      {columnType === "active" && (
        <div className="auction-button-wrapper">
          <PrimaryButton
            onClick={() => navigate(`/auction-monitoring/:${auction.id}`) }
          >
            {" "}
            Monitor{" "}
          </PrimaryButton>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="notice-message">
          <p>
            If any auction was supposed to start and the status is not updated,
            please refresh the page to update the auction status.
          </p>
        </div>
        <div className="auction-columns">
          <div className="auction-column">
            <div className="auction-header">
              <h3>Scheduled</h3>
              <PrimaryButton
                onClick={() => navigate('/new-auction')}
              >
                New Auction
              </PrimaryButton>
            </div>
            <div className="auction-scroll">
              {openAuctions.map((a) => renderAuctionCard(a, false, "open"))}
            </div>
          </div>

          <div className="auction-column">
            <h3>Active</h3>
            <div className="auction-scroll">
              {activeAuctions.map((a) => renderAuctionCard(a, true, "active"))}
            </div>
          </div>

          <div className="auction-column">
            <h3>Closed</h3>
            <div className="auction-scroll">
              {closedAuctions.map((a) => renderAuctionCard(a, true, "closed"))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyerAuctionsDashboard;
