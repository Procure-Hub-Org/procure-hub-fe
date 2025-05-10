import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { isAdmin, isBuyer, isSeller } from "../../utils/auth";
import "../../styles/Admin.css";


const AuctionHistoryModal = ({ open, onClose, auctionId }) => {
  const [historyLogs, setHistoryLogs] = useState([]);

  useEffect(() => {
    if (!open || !auctionId) return;

    // Simulate API call with mock data
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

    let logs = mockData[auctionId] || [];

    if (isSeller()) {
        //route for filtered logs that just show their bids
        const currentSeller = "Alice Smith"; // Simulate logged-in seller name
        logs = logs.filter((log) => log.sellerName === currentSeller);
    } else if (isBuyer() || isAdmin()) {
        // Buyers and Admins see all logs
    } else {
        logs = []; // Unauthorized or unknown role
    }

    const sorted = logs.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    setHistoryLogs(sorted);
  }, [open, auctionId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Auction History
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {historyLogs.length === 0 ? (
          <Typography>No logs found for this auction.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Bid Amount ($)</TableCell>
                <TableCell>Previous Position</TableCell>
                <TableCell>New Position</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyLogs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.sellerName}</TableCell>
                  <TableCell>{log.sellerCompany}</TableCell>
                  <TableCell>{log.bidAmount}</TableCell>
                  <TableCell>{log.previousPosition ?? "-"}</TableCell>
                  <TableCell>{log.newPosition ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuctionHistoryModal;
