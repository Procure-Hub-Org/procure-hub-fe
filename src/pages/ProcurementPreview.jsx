import React from "react";
import { useNavigate } from "react-router-dom";
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

const dummyData = {
    title: "Laptop Purchase",
    description: "Procurement for office laptops",
    location: "Sarajevo",
    deadline: "2025-04-30",
    budgetMin: 5000,
    budgetMax: 10000,
    category: "IT Equipment",
    status: "draft",
    items: [
        { title: "Laptop", description: "Dell XPS 13", quantity: 10 },
        { title: "Docking Station", description: "USB-C compatible", quantity: 10 },
    ],
    requirements: [
        { type: "Warranty", description: "At least 2 years" },
        { type: "Delivery", description: "Within 2 weeks" },
    ],
};

const PreviewProcurement = () => {
    const navigate = useNavigate();
    const data = dummyData; // fetch this by ID.

    const handleEdit = () => {
        // redirect to the edit form with ID (you can store in URL or context)
        navigate(`/new-request/${data.id}`); // example route
    };

    const handleClose = () => {
        console.log('Close preview');
        navigate('/buyer-procurement-requests')
    };

    return (
        <Layout>
            <Container maxWidth="md">
                <Box sx={{ mt: 4, position: "relative" }}>
                    {/* Status Chip */}
                    <Chip
                        label={data.status.toUpperCase()}
                        color={data.status === "draft" ? "warning" : "success"}
                        sx={{ position: "absolute", top: 5, right: 5 }}
                    />

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
                                <strong>Budget Range:</strong> {data.budgetMin} - {data.budgetMax} BAM
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                                <strong>Category:</strong> {data.category}
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
                                        <Typography variant="subtitle1" sx={{ mb: 1}}>
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
                                    <PrimaryButton onClick={handleEdit} startIcon={<EditIcon />}>
                                        Edit Procurement
                                    </PrimaryButton>
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
};

export default PreviewProcurement;

