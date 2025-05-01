import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import PrimaryButton from "../components/Button/PrimaryButton";
import "../styles/Admin.css";
import { isAuthenticated, isAdmin } from "../utils/auth.jsx";
import {useNavigate, useParams} from "react-router-dom";
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import "../styles/AuctionsDashboard.css"


const AdminAuctionsDashboard = () => {
    const theme = useTheme();
    const [openAuctions, setOpenAuctions] = useState([]);
    const [activeAuctions, setActiveAuctions] = useState([]);
    const [closedAuctions, setClosedAuctions] = useState([]);
  
    useEffect(() => {
        const mockData = [
          // OPEN
          {
            id: 1,
            buyerEmail: "buyer1@example.com",
            requestTitle: "Office Chairs",
            startingTime: "2025-06-01T10:00:00Z",
            endingTime: "2025-06-01T12:00:00Z",
            duration: 60,
            minIncrement: 10,
            lastCallTimer: 30,
          },
          {
            id: 2,
            buyerEmail: "buyer2@example.com",
            requestTitle: "Laptop Purchase",
            startingTime: "2025-06-03T12:00:00Z",
            endingTime: "2025-06-03T14:00:00Z",
            duration: 45,
            minIncrement: 20,
            lastCallTimer: 60,
          },
          {
            id: 3,
            buyerEmail: "buyer3@example.com",
            requestTitle: "Tablets",
            startingTime: "2025-06-02T14:00:00Z",
            endingTime: "2025-06-02T16:00:00Z",
            duration: 90,
            minIncrement: 15,
            lastCallTimer: 45,
          },
          {
            id: 4,
            buyerEmail: "buyer4@example.com",
            requestTitle: "Projectors",
            startingTime: "2025-06-05T09:00:00Z",
            endingTime: "2025-06-05T11:00:00Z",
            duration: 120,
            minIncrement: 50,
            lastCallTimer: 60,
          },
      
          // ACTIVE
          {
            id: 5,
            buyerEmail: "buyer5@example.com",
            requestTitle: "Office Supplies",
            startingTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            endingTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            duration: 60,
            minIncrement: 5,
            lastCallTimer: 15,
            winningBid: 300,
            winningSeller: {
              name: "Bob",
              companyName: "SupplyCo",
            },
          },
          {
            id: 6,
            buyerEmail: "buyer6@example.com",
            requestTitle: "Whiteboards",
            startingTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            endingTime: new Date(Date.now() + 50 * 60 * 1000).toISOString(),
            duration: 60,
            minIncrement: 8,
            lastCallTimer: 30,
            winningBid: 120,
            winningSeller: {
              name: "Linda",
              companyName: "EduStore",
            },
          },
          {
            id: 7,
            buyerEmail: "buyer7@example.com",
            requestTitle: "Cleaning Services",
            startingTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
            endingTime: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
            duration: 90,
            minIncrement: 12,
            lastCallTimer: 20,
            winningBid: 750,
            winningSeller: {
              name: "Sara",
              companyName: "CleanIt",
            },
          },
          {
            id: 8,
            buyerEmail: "buyer8@example.com",
            requestTitle: "Stationery",
            startingTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            endingTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
            duration: 100,
            minIncrement: 6,
            lastCallTimer: 25,
            winningBid: 210,
            winningSeller: {
              name: "Leo",
              companyName: "OfficeMax",
            },
          },
      
          // CLOSED
          {
            id: 9,
            buyerEmail: "buyer9@example.com",
            requestTitle: "Desks",
            startingTime: "2025-04-20T08:00:00Z",
            endingTime: "2025-04-20T10:00:00Z",
            duration: 120,
            minIncrement: 20,
            lastCallTimer: 30,
            winningBid: 800,
            winningSeller: {
              name: "Nina",
              companyName: "FurniShop",
            },
          },
          {
            id: 10,
            buyerEmail: "buyer10@example.com",
            requestTitle: "Smartboards",
            startingTime: "2025-04-21T13:00:00Z",
            endingTime: "2025-04-21T15:00:00Z",
            duration: 90,
            minIncrement: 25,
            lastCallTimer: 60,
            winningBid: 1600,
            winningSeller: {
              name: "Jack",
              companyName: "SmartTech",
            },
          },
          {
            id: 11,
            buyerEmail: "buyer11@example.com",
            requestTitle: "Monitors",
            startingTime: "2025-04-22T10:00:00Z",
            endingTime: "2025-04-22T11:30:00Z",
            duration: 45,
            minIncrement: 10,
            lastCallTimer: 30,
            winningBid: 500,
            winningSeller: {
              name: "Emma",
              companyName: "VisionTech",
            },
          },
          {
            id: 12,
            buyerEmail: "buyer12@example.com",
            requestTitle: "Webcams",
            startingTime: "2025-04-23T14:00:00Z",
            endingTime: "2025-04-23T16:00:00Z",
            duration: 60,
            minIncrement: 5,
            lastCallTimer: 20,
            winningBid: 320,
            winningSeller: {
              name: "Mila",
              companyName: "CamWorld",
            },
          },
        ];
      
        const now = new Date();
      
        const open = [];
        const active = [];
        const closed = [];
      
        mockData.forEach(auction => {
          const startingTime = new Date(auction.startingTime);
          const endingTime = new Date(auction.endingTime);
      
          if (startingTime > now) {
            open.push(auction);
          } else if (startingTime <= now && endingTime >= now) {
            active.push(auction);
          } else if (endingTime < now) {
            closed.push(auction);
          }
        });
      
        setOpenAuctions(open);
        setActiveAuctions(active);
        setClosedAuctions(closed);
      }, []);
      
      
      
  
      const renderAuctionCard = (auction, hasWinner) => (
        <div className="auction-card" key={auction.id} style={{ backgroundColor: theme.palette.background.paper }}>
          <div style={{ width: '100%' }}>
          <p><strong>Buyer:</strong> {auction.buyerEmail}</p>
          <p><strong>Request:</strong> {auction.requestTitle}</p>
          </div>
          <p><strong>Start:</strong> {new Date(auction.startingTime).toLocaleString()}</p>
          <p><strong>Duration:</strong> {auction.duration} min</p>
          <p><strong>Min Increment:</strong> {auction.minIncrement}</p>
          <p><strong>Last Call:</strong> {auction.lastCallTimer} min</p>
          {hasWinner && auction.winningBid && auction.winningSeller && (
            <>
              <p><strong>Winning Bid:</strong> {auction.winningBid}</p>
              <p><strong>Winner:</strong> {auction.winningSeller.name} ({auction.winningSeller.companyName})</p>
            </>
          )}
        </div>
      );
      

  
      return (
        <Layout>
          <div className="dashboard-container">
            <div className="notice-message">
              <p>
                If any auction was supposed to start and the status is not updated, please refresh the page to update the auction status.
              </p>
            </div>
            <div className="auction-columns">
              <div className="auction-column">
                <h3>Open</h3>
                <div className="auction-scroll">
                  {openAuctions.map(a => renderAuctionCard(a, false))}
                </div>
              </div>
      
              <div className="auction-column">
                <h3>Active</h3>
                <div className="auction-scroll">
                  {activeAuctions.map(a => renderAuctionCard(a, true))}
                </div>
              </div>
      
              <div className="auction-column">
                <h3>Closed</h3>
                <div className="auction-scroll">
                  {closedAuctions.map(a => renderAuctionCard(a, true))}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      );
      
      
  };
  
  export default AdminAuctionsDashboard;