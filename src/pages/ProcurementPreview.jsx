import React, { use, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { isAuthenticated, isBuyer } from '../utils/auth';
import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
    Chip,
} from "@mui/material";
import Layout from "../components/Layout/Layout";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";
import PrimaryButton from "../components/Button/PrimaryButton.jsx";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const PreviewProcurement = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const [data, setData] = useState(null);
    const { id } = useParams(); 
    //const data = dummyData; // fetch this by ID.

    useEffect(() => {
        if (!isBuyer()) {
            if (!isAuthenticated()) {
                window.location.href = "/login";
            } else {
                window.location.href = "/";
            }
            return;
        }

        axios.get(`${import.meta.env.VITE_API_URL}/api/procurement-request/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                setData(response.data);
                console.log("Fetched request data:", response.data);
            })
            .catch((error) => {
                console.error(`Error fetching request with id=${id}:`, error);
            });
        
    }, [token, id]);

    const handleEdit = () => {
        // Redirect to the BuyerProcurementForm with the data pre-filled for editing
        console.log("Data to send to form:", data);
        navigate(`/edit-request/${data.id}`, { state: { procurementData: data } });
    };

    const handleClose = () => {
        console.log('Close preview');
        navigate('/buyer-procurement-requests')
    };

    const handleState = (status) => {
        axios.put(`${import.meta.env.VITE_API_URL}/api/procurement/${data.id}/status`, 
            { id: data.id, status: status}, 
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then((response) => {
                console.log('Request status updated:', response.data);
                navigate('/buyer-procurement-requests');
            })
            .catch((error) => {
                console.error('Error updating request status:', error);
            });
            console.log('Close request');
    }

    if (!data) {
        return (
            <Layout>
                <Container maxWidth="md">
                    <Typography variant="h6" sx={{ mt: 4 }}>Loading procurement request...</Typography>
                </Container>
            </Layout>
        );
    }else{
        return (
            <Layout>
                <Container maxWidth="md">
                    <Box sx={{ mt: 4, position: "relative" }}>
                        {/* Status and Awarded-to Box Grouped */}
                        <Box sx={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                        }}>
                            {/* Status Chip */}
                            <Chip
                                label={data.status.toUpperCase()}
                                color={data.status === "draft" ? "warning" : "success"}
                                sx={{ mb: 1 }}
                            />
                            
    
                            {/* Show "Awarded To" if status is "awarded" */}
                            {data.status === "awarded" && (
                                <Box>
                                    <Typography variant="body1" color="primary">
                                        <strong>Awarded to: </strong> Jane Doe
                                    </Typography>
                                </Box>
                            )}
                        </Box>
    
                        <Card>
                            <CardContent>
                                <Typography variant="h3" gutterBottom>
                                    {data.title}
                                </Typography>
    
                                <Typography variant="body1" gutterBottom>
                                    <strong>Description:</strong> {data.description}
                                </Typography>
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Location:</strong> {data.location}
                                </Typography>
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Deadline:</strong> {data.deadline}
                                </Typography>
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Budget Range:</strong> {data.budget_min} - {data.budget_max} BAM
                                </Typography>
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Category:</strong> {data.procurementCategory.name}
                                </Typography>
    
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h5" fontWeight={"bolder"}>Items</Typography>
                                    {data.items.map((item, index) => (
                                        <Box key={index} sx={{
                                            mb: 2,
                                            p: 2,
                                            border: '1px solid #ccc',
                                            borderRadius: 2,
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                        }}>
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {item.description}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Quantity: </strong> {item.quantity}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
    
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h5" fontWeight={"bolder"}>Requirements</Typography>
                                    {data.requirements.map((req, index) => (
                                        <Box key={index} sx={{
                                            mb: 2,
                                            p: 2,
                                            border: '1px solid #ccc',
                                            borderRadius: 2,
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                        }}>
                                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                                Requirement type: <strong>{req.type}</strong>
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {req.description}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
    
                                <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                                    {data.status === "draft" && (
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <PrimaryButton onClick={handleEdit} startIcon={<EditIcon />}>
                                                Edit Procurement
                                            </PrimaryButton> 
    
                                            <PrimaryButton onClick={() => handleState("active")} startIcon={<SendIcon />}>
                                                Post request       
                                            </PrimaryButton>           
                                        </Box>
                                        
                                    )}
                                    {data.status === "active" && (
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <PrimaryButton onClick={() => handleState("closed")} startIcon={<CloseIcon />}>
                                                Close Request
                                            </PrimaryButton>
    
                                            <PrimaryButton onClick={() => handleState("awarded")} startIcon={<StarIcon />}>
                                                Award 
                                            </PrimaryButton>
                                        </Box>
                                        
                                    )}
                                    <SecondaryButton onClick={handleClose}>
                                        Close Preview
                                    </SecondaryButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Layout>
        );
    }
};

export default PreviewProcurement;

