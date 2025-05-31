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
  Box
} from "@mui/material";
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DocIcon from '@mui/icons-material/Description';
import JpgIcon from '@mui/icons-material/Image';
import FileIcon from '@mui/icons-material/FilePresent';
import PrimaryButton from "../../Button/PrimaryButton";
import SecondaryButton from "../../Button/SecondaryButton";
import axios from "axios";
import { isAuthenticated, isBuyer, isSeller, isAdmin } from "../../../utils/auth";

const ContractInfoPopup = ({ open, onClose, contractId }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  function getIconForFileType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PdfIcon color="action" />;
      case 'doc':
      case 'docx':
        return <DocIcon color="action" />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <JpgIcon color="action" />;
      default:
        return <FileIcon color="action" />;
    }
  }

  useEffect(() => {
    if (!open) return;
    if (!isAuthenticated()) {
      onClose();
      return;
    }

    setUserRole(isBuyer() ? "buyer" : isSeller() ? "seller" : isAdmin() ? "admin" : "guest");

    const fetchContract = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contracts/${contractId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Uzimamo PRVI (i jedini) objekat iz niza
        setContract(response.data[0]);
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setContract(null);
      }
      setLoading(false);
    };

    fetchContract();
  }, [open, contractId, onClose]);

  const renderStatus = () => contract?.status ?? "N/A";

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
            <Paper elevation={2} sx={{ p: 2, backgroundColor: "#fafafa" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>General Information</Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography><strong>Title:</strong> {contract.procurement_request_title}</Typography>
              <Typography><strong>Category:</strong> {contract.procurement_category}</Typography>
              <Typography><strong>Price:</strong> {contract.price}</Typography>
              <Typography><strong>Delivery Terms:</strong> {contract.delivery_terms}</Typography>
              <Typography><strong>Status:</strong> {renderStatus()}</Typography>
              <Typography><strong>Buyer:</strong> {contract.buyer_name} ({contract.buyer_email})</Typography>
              <Typography><strong>Seller:</strong> {contract.seller_name} ({contract.seller_email})</Typography>
            </Paper>

            {/* Documents Section */}
            {contract.contract_document_url ? (
              <Paper elevation={2} sx={{ p: 2, backgroundColor: "#fafafa", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Documents</Typography>
                <Divider sx={{ mb: 1 }} />
                <Paper sx={{ p: 2, my: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {getIconForFileType(contract.contract_document_url)}
                    <Box>
                      <Typography fontWeight="bold">
                        <a href={contract.contract_document_url} target="_blank" rel="noopener noreferrer">
                          View Document
                        </a>
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Paper>
            ) : (
              <Typography>No documents have been uploaded.</Typography>
            )}

            {/* Payment Instructions */}
            <Paper elevation={2} sx={{ p: 2, backgroundColor: "#f0f0f0" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Payment Instructions</Typography>
              <Divider sx={{ mb: 1 }} />
              {contract.payment_instructions?.length > 0 ? (
                contract.payment_instructions.map((payment, idx) => (
                  <Paper key={idx} elevation={1} sx={{ p: 1, mb: 1 }}>
                    <Typography><strong>Payment Date:</strong> {new Date(payment.date).toLocaleDateString()}</Typography>
                    <Typography><strong>Amount:</strong> {payment.amount}</Typography>
                    <Typography><strong>Policy:</strong> {payment.payment_policy}</Typography>
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
        {contract && userRole === "seller" && contract.status !== "signed" && (
          <>
            <PrimaryButton onClick={() => alert("Seller accepted the contract.")}>Accept</PrimaryButton>
            <PrimaryButton onClick={() => alert("Request changes.")}>Request Changes</PrimaryButton>
          </>
        )}
        {contract && userRole === "buyer" && contract.status !== "signed" && (
          <PrimaryButton onClick={() => alert("Edit contract.")}>Edit</PrimaryButton>
        )}
        {(userRole === "buyer" || userRole === "seller") && (
          <PrimaryButton onClick={() => alert("View requested changes.")}>View Requested Changes</PrimaryButton>
        )}
        {userRole === "admin" && (
          <PrimaryButton onClick={() => alert("View logs.")}>View Logs</PrimaryButton>
        )}
        <SecondaryButton onClick={onClose} style={{ padding: '6px 14px' }}>
          Close
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default ContractInfoPopup;
