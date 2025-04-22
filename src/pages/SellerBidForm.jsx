import React, { useState, useEffect } from "react";

import PrimaryButton from "../components/Button/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../components/Input/TextField";
import CustomSelect from "../components/Input/DropdownSelect";
import { isAuthenticated, isBuyer, isSeller } from '../utils/auth';
import {
    AppBar,
    Box,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import OutlinedButton from "../components/Button/OutlinedButton.jsx";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";

import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

// import { useTheme } from "@mui/system";

const BidForm = () => {
    const { id } = useParams(); 
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        price: "",
        timeline: "",
        proposal_text: "",

    });

    const navigate = useNavigate();

    // Load if id exists
    useEffect(() => {
        if (!isSeller()) {
            if (!isAuthenticated()) {
                window.location.href = "/login";
            } else {
                window.location.href = "/"
            }
            return;
        }
        
    }, [token]);

   

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    const handleCloseForm = () => {
        navigate(`/seller-procurement-requests`); 
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitted form:", formData);

        const requestData = {
            // procurement_request_id: 1, //dummy data
                price: formData.price,
                timeline: formData.timeline,
                proposal_text: formData.proposal_text,
                submitted: false, 
        };
          
    
        console.log("Sending request data:", requestData);
        
          
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/bid/create`, requestData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            );
        
            if (response.status === 200 || response.status === 201) {
               
                console.log("Server Response:", response.data);
                const bidId = response.data.bid.id;//preuzimanje id-ja bida i prenosenje u bid preview
                navigate(`/preview-bid/${bidId}`, { state: { formData } });
            } else {
                alert("Request adding failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Error during creation of request:", error);
            if (error.response) {
                alert("Request adding failed: " + error.response.data.message);
            } else {
                alert("Request adding failed: " + error.message);
            }
        };
    };

    const handleSaveDraft = async (e) => {
        e.preventDefault();
        console.log("Submitted form:", formData);
        

        const requestData = {
            price: formData.price,
            timeline: formData.timeline,
            proposal_text: formData.proposal_text,
            submitted: false,


            ///////////////////////////////////////////////ovo ispod je dummy 
                // procurement_request_id: 1, 
                // price: formData.price,
                // timeline: formData.timeline,
                // proposal_text: formData.proposal_text,
                // submitted: false, 
             
            
        };
          
    
        console.log("Sending request data:", requestData);
          
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/bid/create`, requestData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            // console.log(response.status);
            if (response.status === 200 || response.status === 201) {
                alert("Request adding Successful!");
                console.log("Server Response:", response.data);
                navigate("/seller-bids"); 
            } else {
                alert("Request adding failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Error during creation of request:", error);
            if (error.response) {
                alert("Request adding failed: " + error.response.data.message);
            } else {
                alert("Request adding failed: " + error.message);
            }
        };
    }

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
                                    Create Bid
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
                                    <SecondaryButton type="button" onClick={() => handleCloseForm()} startIcon={<CloseIcon />}>
                                        Cancel
                                    </SecondaryButton>

                                    <PrimaryButton type="save-draft" onClick={handleSaveDraft} startIcon={<SaveIcon />}>
                                        Save Draft
                                    </PrimaryButton>

                                    <PrimaryButton type="submit" onClick={handleSubmit} fullWidth startIcon={<SendIcon />}>
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

export default BidForm;