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
  TableContainer
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { isAdmin, isBuyer, isSeller } from "../../utils/auth";
import "../../styles/Admin.css";
import { useTheme } from "@mui/material/styles";
import axios from "axios";


const AuctionHistoryModal = ({ open, onClose, auctionId }) => {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

useEffect(() => {
  if (!open || !auctionId) return;

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auction/${auctionId}/history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log(response.data);
      setHistoryLogs(response.data);
    } catch (error) {
      console.error('Error fetching auction history:', error);
    }
  };

  fetchHistory();
}, [open, auctionId]);


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Auction History
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        {historyLogs.length === 0 ? (
          <Typography>No logs found for this auction.</Typography>
        ) : (
          <TableContainer>
            <Table sx={{ fontSize: "1rem" }}>
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
                    <TableCell>{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell>{log.sellerName}</TableCell>
                    <TableCell>{log.sellerCompany}</TableCell>
                    <TableCell>
                      {log.bidAmount}
                      {log.previousPosition === null && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.secondary.main,
                            marginLeft: 1,
                            fontSize: "0.9rem",
                          }}
                        >
                          (Initial bid)
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{log.previousPosition ?? "-"}</TableCell>
                    <TableCell>{log.newPosition ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
