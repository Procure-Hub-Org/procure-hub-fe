import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import axios from "axios";

// Layout and Buttons
import Layout from "../components/Layout/Layout";
import PrimaryButton from "../components/Button/PrimaryButton";
import SecondaryButton from "../components/Button/SecondaryButton";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useParsedFormat } from "@mui/x-date-pickers";

const BidPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const { id }  = useParams()


  if (!formData) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ mt: 5 }}>
          <Typography variant="h6" align="center">
            No bid data to preview.
          </Typography>
        </Container>
      </Layout>
    );
  }

  const handleCancel = () => {
    navigate(`/edit-bid/${id}`, { state: { formData } });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bid/${id}/submit`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Bid submitted successfully!");
        navigate("/seller-bids");
      } else {
        alert("Bid submission failed.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred while submitting the bid.");
    }
  };

  return (
    <Layout>
      <AppBar position="static">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Container maxWidth="sm">
            <Card sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom align="center">
                  Preview Your Bid
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Price:</strong> {formData.price}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Timeline:</strong> {formData.timeline}
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" fontWeight="bold">Proposal:</Typography>
                    <Box
                        sx={{
                            whiteSpace: "pre-line",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            // border: "1px solid #ccc",
                            borderRadius: 1,
                            padding: 1,
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                    {formData.proposal_text}
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                  <SecondaryButton
                    onClick={handleCancel}
                    fullWidth
                    startIcon={<CloseIcon />}
                  >
                    Cancel
                  </SecondaryButton>

                  <PrimaryButton
                    onClick={handleSubmit}
                    fullWidth
                    startIcon={<SendIcon />}
                  >
                    Submit Bid
                  </PrimaryButton>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </AppBar>
    </Layout>
  );
};

export default BidPreview;
