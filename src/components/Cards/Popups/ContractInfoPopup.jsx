import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Button,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import PrimaryButton from "../../Button/PrimaryButton";
import { isAuthenticated, isBuyer, isSeller, isAdmin } from "../../../utils/auth";
import OutlinedButton from "../../Button/OutlinedButton";

const ContractInfoPopup = ({ open, onClose, contractId }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (!open) return;  // Samo ako se otvara

    if (!isAuthenticated()) {
        onClose(); // Samo ako nije autentifikovan
        return;
    }

    if (isBuyer()) {
      setUserRole("buyer");
    } else if (isSeller()) {
      setUserRole("seller");
    } else if (isAdmin()) {
      setUserRole("admin");
    } else {
      setUserRole("guest");
    }

    const fetchMockContract = async () => {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 500));

      const mock = {
        contractId: 1,
        awardingDate: "2025-06-01",
        price: "$10,000",
        deliveryConditions: "Delivery by 2025-06-15, FOB Shipping Point",
        status: isSeller() || isAdmin() ? "Issued" : "Draft",
        paymentInstructions: {
          policy: "Quarterly",
          details: [
            { date: "2025-07-01", amount: "$2,500" },
            { date: "2025-10-01", amount: "$2,500" },
            { date: "2026-01-01", amount: "$2,500" },
            { date: "2026-04-01", amount: "$2,500" },
          ],
        },
        notifications: [
          "Contract issued by buyer",
          "Seller requested changes",
          "Buyer edited contract",
        ],
        logs: [
          {
            action: "Contract issued",
            user: "Buyer John",
            timestamp: "2025-05-01 10:00",
          },
          {
            action: "Seller requested changes",
            user: "Seller Anna",
            timestamp: "2025-05-02 12:00",
          },
        ],
        changeRequests: [
          {
            seller: "Anna",
            message: "Change delivery date to 2025-06-20",
            createdAt: "2025-05-02",
          },
        ],
      };
      setContract(mock);
      setLoading(false);
    };

    fetchMockContract();
  }, [open]);

  const renderStatus = () => contract?.status ?? "N/A";

  const handleAccept = () => {
    alert("Seller accepted the contract. Prompt for bank account entry here.");
  };

  const handleRequestChanges = () => {
    alert("Open popup for submitting change request.");
  };

  const handleEditContract = () => {
    alert("Open popup for contract editing.");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle fontWeight="bold">Contract Details</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : contract ? (
          <Stack spacing={3}>
            {/* General Info */}
            <Paper elevation={2} sx={{ p: 2, backgroundColor: "#fafafa" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                General Information
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography><strong>Awarding Date:</strong> {new Date(contract.awardingDate).toLocaleDateString()}</Typography>
              <Typography><strong>Price:</strong> {contract.price}</Typography>
              <Typography><strong>Delivery Conditions:</strong> {contract.deliveryConditions}</Typography>
              <Typography><strong>Status:</strong> {renderStatus()}</Typography>
            </Paper>

            {/* Payment Instructions */}
            <Paper elevation={2} sx={{ p: 2, backgroundColor: "#f0f0f0" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Payment Instructions
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {contract.paymentInstructions && contract.paymentInstructions.details.length > 0 ? (
                contract.paymentInstructions.details.map((payment, idx) => (
                  <Paper key={idx} elevation={1} sx={{ p: 1, mb: 1 }}>
                    <Typography><strong>Payment Date:</strong> {new Date(payment.date).toLocaleDateString()}</Typography>
                    <Typography><strong>Amount:</strong> {payment.amount}</Typography>
                    <Typography><strong>Policy:</strong> {contract.paymentInstructions.policy}</Typography>
                  </Paper>
                ))
              ) : (
                <Typography>No payment instructions available.</Typography>
              )}
            </Paper>
          </Stack>
        ) : (
          <Typography>Failed to load contract data.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {contract && userRole === "seller" && contract.status !== "Signed" && (
          <>
            <PrimaryButton onClick={handleAccept} >
              Accept
            </PrimaryButton>
            <PrimaryButton onClick={handleRequestChanges} >
              Request Changes
            </PrimaryButton>
          </>
        )}
        {contract && userRole === "buyer" && contract.status !== "Signed" && (
          <PrimaryButton onClick={handleEditContract} >
            Edit
          </PrimaryButton>
        )}
        {(userRole === "buyer" || userRole === "seller") && (
          <PrimaryButton onClick={() => alert("View Requested Changes")} >
            View Requested Changes
          </PrimaryButton>
        )}
        {userRole === "admin" && (
          <PrimaryButton onClick={() => alert("View Logs")} >
            View Logs
          </PrimaryButton>
        )}
        <OutlinedButton onClick={onClose} variant="outlined" >
          Close
        </OutlinedButton>
      </DialogActions>
    </Dialog>
  );
};

export default ContractInfoPopup;
