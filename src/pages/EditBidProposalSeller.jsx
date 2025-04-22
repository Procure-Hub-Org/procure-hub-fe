import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PrimaryButton from "../components/Button/PrimaryButton";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import Layout from "../components/Layout/Layout";
import { isAuthenticated, isSeller } from "../utils/auth";

const EditBidProposal = () => {
  const { id } = useParams(); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  

  const [formData, setFormData] = useState({
    price: "",
    timeline: "",
    proposal_text: "",
  });

  useEffect(() => {
   
    if (!isSeller()) {
      if (!isAuthenticated()) {
        window.location.href = "/login";
      } else {
        window.location.href = "/";
      }
      return;
    }

   
    const fetchBidData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bid/${id}/preview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.status)
        // console.log(response)
        if (response.status === 200) {
          const bidData = response.data.bid; 
          setFormData({
            price: bidData.price,
            timeline: bidData.timeline,
            proposal_text: bidData.proposal_text,
          });
        } else {
          alert("Failed to fetch bid data.");
        }
      } catch (error) {
        console.error("Error fetching bid data:", error);
        alert("An error occurred while fetching bid data.");
      }
    };

    fetchBidData();
}, [id, token]);



    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseForm = () => {
    navigate(`/preview-bid/${id}`, { state: { formData } }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted form:", formData);

    const requestData = {
      price: formData.price,
      timeline: formData.timeline,
      proposal_text: formData.proposal_text,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bid/${id}/update`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Bid updated and submitted successfully!");
        navigate(`/preview-bid/${id}`, { state: { formData } });
      } else {
        alert("Bid update failed.");
      }
    } catch (error) {
      console.error("Error during bid update:", error);
      if (error.response) {
        alert("Bid update failed: " + error.response.data.message);
      } else {
        alert("Bid update failed: " + error.message);
      }
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    console.log("Saved as draft:", formData);

    const requestData = {
      price: formData.price,
      timeline: formData.timeline,
      proposal_text: formData.proposal_text,
      submitted: false,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bid/${id}/update`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Bid saved as draft successfully!");
        navigate("/seller-bids");
      } else {
        alert("Failed to save bid as draft.");
      }
    } catch (error) {
      console.error("Error saving bid draft:", error);
      if (error.response) {
        alert("Failed to save bid as draft: " + error.response.data.message);
      } else {
        alert("Failed to save bid as draft: " + error.message);
      }
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
                  Edit Bid
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Proposal"
                    name="proposal_text"
                    value={formData.proposal_text}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    minRows={4}
                    maxRows={12}
                    sx={{ mb: 2 }}
                  />
                  <SecondaryButton
                    type="button"
                    onClick={handleCloseForm}
                    startIcon={<CloseIcon />}
                  >
                    Cancel
                  </SecondaryButton>

                  <PrimaryButton type="button" onClick={handleSaveDraft} startIcon={<SaveIcon />}>
                    Save Draft
                  </PrimaryButton>

                  <PrimaryButton type="submit" startIcon={<SendIcon />} fullWidth>
                    Submit Bid
                  </PrimaryButton>
                </form>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </AppBar>
    </Layout>
  );
};

export default EditBidProposal;
