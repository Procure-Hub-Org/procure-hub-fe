import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useTheme } from "@mui/material/styles";
import "../styles/Admin.css";
import { useParams } from "react-router-dom";
import { isAdmin, isBuyer, isSeller } from "../utils/auth";

const AuctionHistoryPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [historyLogs, setHistoryLogs] = useState([]);

  useEffect(() => {
    // Simulate API call with mock data depending on auction ID and user role
    const mockData = {
      1: [
        {
          timestamp: "2025-05-10 10:05:00",
          sellerName: "Alice Smith",
          sellerCompany: "AlphaTech",
          bidAmount: 500,
          previousPosition: 2,
          newPosition: 1,
        },
        {
          timestamp: "2025-05-10 09:55:00",
          sellerName: "Bob Johnson",
          sellerCompany: "BetaCorp",
          bidAmount: 520,
          previousPosition: 1,
          newPosition: 2,
        },
        {
          timestamp: "2025-05-10 09:45:00",
          sellerName: "Charlie Lee",
          sellerCompany: "GammaGroup",
          bidAmount: 530,
          previousPosition: null,
          newPosition: 3,
        },
      ],
      2: [
        {
          timestamp: "2025-04-28 14:10:00",
          sellerName: "Derek Adams",
          sellerCompany: "ZetaWorks",
          bidAmount: 620,
          previousPosition: 2,
          newPosition: 1,
        },
      ],
    };

    let logs = mockData[id] || [];

 
    if (isSeller()) {
      //route for filtered logs that just show their bids
      const currentSeller = "Alice Smith"; // Simulate logged-in seller name
      logs = logs.filter((log) => log.sellerName === currentSeller);
    } else if (isBuyer() || isAdmin()) {
      // Buyers and Admins see all logs
    } else {
      logs = []; // Unauthorized or unknown role
    }

    // Sort logs by newest first
    const sortedLogs = logs.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setHistoryLogs(sortedLogs);
  }, [id]);

  return (
    <Layout>
      <div className="dashboard-container">
        <h2>Auction History</h2>
        {historyLogs.length === 0 ? (
          <p>No logs found for this auction.</p>
        ) : (
          <div className="panel">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Timestamp</th>
                  <th className="th">Seller</th>
                  <th className="th">Company</th>
                  <th className="th">Bid Amount ($)</th>
                  <th className="th">Previous Position</th>
                  <th className="th">New Position</th>
                </tr>
              </thead>
              <tbody>
                {historyLogs.map((log, index) => (
                  <tr key={index} className="tr">
                    <td className="td">{log.timestamp}</td>
                    <td className="td">{log.sellerName}</td>
                    <td className="td">{log.sellerCompany}</td>
                    <td className="td">{log.bidAmount}</td>
                    <td className="td">{log.previousPosition ?? "-"}</td>
                    <td className="td">{log.newPosition ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuctionHistoryPage;
