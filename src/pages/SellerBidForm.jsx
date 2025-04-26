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
import NotificationSuccsesToast from "../components/Notifications/NotificationSuccsesToast";
import NotificationErrorToast from "../components/Notifications/NotificationErrorToast";

import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

// import { useTheme } from "@mui/system";

const BidForm = () => {
    const { requestId } = useParams();
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        price: "",
        timeline: "",
        proposal_text: "",

    });

    const navigate = useNavigate();
    const [fieldErrors, setFieldErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    
    const showToast = (message, type) => {
        setToast({ show: false, message: '', type: '' }); // Reset first
        setTimeout(() => {
          setToast({ show: true, message, type });
        }, 0); // Set after a tiny delay
      };

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
            procurement_request_id: requestId,
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
                showToast('Request submit Successful!','success' );
                console.log("Server Response:", response.data);
                const bidId = response.data.bid.id;//preuzimanje id-ja bida i prenosenje u bid preview
                navigate(`/preview-bid/${bidId}`, { state: { formData } });
            } else {
                showToast("Request adding failed: " + response.data.message,'error' );
                //alert("Request adding failed: " + response.data.message);
            }
        } catch (error) {
            showToast("Request adding failed: " + error.response.data.message,'error' );
            console.error("Error during creation of request:", error);
            if (error.response) {
                //alert("Request adding failed: " + error.response.data.message);
            } else {
                showToast("Request adding failed: " + error.message,'error' );
                //alert("Request adding failed: " + error.message);
            }
        };
    };

    const handleSaveDraft = async (e) => {
        e.preventDefault();
        console.log("Submitted form:", formData);


        const requestData = {
            procurement_request_id: requestId,
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
                showToast('Request saving Successful!','success' );
                console.log("Server Response:", response.data);
                navigate("/seller-bids");
            } else {
                showToast("Request adding failed: " + response.data.message,'error' );
                //alert("Request adding failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Error during creation of request:", error);
            if (error.response) {
                showToast("Request adding failed: " + error.response.data.message,'error' );
                //alert("Request adding failed: " + error.response.data.message);
            } else {
                showToast("Request adding failed: " + error.message,'error' );
                //alert("Request adding failed: " + error.message);
            }
        };
    }



    // Handles blur for simple fields
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateField = (name, value) => {
        const rules = validationRules[name];
        if (!rules) return "";
        for (let rule of rules) {
            if (!rule.test(value)) return rule.message;
        }
        return "";
    };

    const validationRules = {
        price: [
            { test: (value) => !!value, message: "Price is required" },
            { test: (value) => !isNaN(value) && Number(value) >= 0, message: "Price must be a valid number" },
        ],
        timeline: [
            { test: (value) => !!value?.trim(), message: "Timeline is required" },
        ],
        proposal_text: [
            { test: (value) => !!value?.trim(), message: "Proposal is required" },
        ],
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
                                        onBlur={handleBlur}
                                        error={touchedFields.price && !!fieldErrors.price}
                                        helperText={touchedFields.price ? fieldErrors.price : ""}
                                    />
                                    <TextField
                                        label="Timeline"
                                        name="timeline"
                                        value={formData.timeline}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                        onBlur={handleBlur}
                                        error={touchedFields.timeline && !!fieldErrors.timeline}
                                        helperText={touchedFields.timeline ? fieldErrors.timeline : ""}
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
                                        onBlur={handleBlur}
                                        error={touchedFields.proposal_text && !!fieldErrors.proposal_text}
                                        helperText={touchedFields.proposal_text ? fieldErrors.proposal_text : ""}
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
                        {toast.show && toast.type === 'success' && (
                            <NotificationSuccsesToast
                                message={toast.message}
                                autoHideDuration={3000}
                                onClose={() => setToast({ ...toast, show: false })}
                            />
                        )}

                        {toast.show && toast.type === 'error' && (
                            <NotificationErrorToast
                                message={toast.message}
                                autoHideDuration={3000}
                                onClose={() => setToast({ ...toast, show: false })}
                            />
                        )}
                    </Container>
                </Box>
            </AppBar>
        </Layout>
    );
};

export default BidForm;