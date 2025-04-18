import React, { use, useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import {Box, Card, CardContent, Chip, Container, Typography} from "@mui/material";
// import PrimaryButton from "../components/Button/PrimaryButton.jsx";
// import EditIcon from "@mui/icons-material/Edit";
// import SendIcon from "@mui/icons-material/Send";
// import CloseIcon from "@mui/icons-material/Close";
// import StarIcon from "@mui/icons-material/Star";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";
import {isAuthenticated, isAdmin} from "../utils/auth.jsx";
import axios from "axios";
import {useTheme} from "@mui/material/styles";

/* Dummy data jer nije implemented api*/
const dummyData = {
    id: 1,
    title: "Procurement of Office Chairs",
    description: "Need ergonomic chairs for all offices",
    location: "Sarajevo",
    deadline: "2025-05-01",
    budget_min: 500,
    budget_max: 1500,
    status: "draft",
    procurementCategory: {
        name: "Office Equipment"
    },
    items: [
        { title: "Chair Model A", description: "Mesh back, adjustable height", quantity: 20 },
        { title: "Chair Model B", description: "Leather, fixed arms", quantity: 10 }
    ],
    requirements: [
        { type: "Delivery", description: "Within 10 days after contract signing" },
        { type: "Warranty", description: "Minimum 2 years" }
    ]
};

const AdminProcurementPreview = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const token = localStorage.getItem("token");
    const [data, setData] = useState(null);
    const { id } = useParams();
    //const data = dummyData; // fetch this by ID.

    useEffect(() => {
        if (!isAdmin()) {
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

    const handleClose = () => {
        console.log('Close preview');
        navigate('/admin-procurement-requests')
    };

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
                <Container maxWidth="sm">
                    {/* Request details - preview of the request and additional buttons*/}
                    <Container maxWidth="sm">
                        <Box sx={{mt: 4, position: "relative"}}>
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
                                    sx={{mb: 1}}
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
                                    <Typography sx={{mb: 1}}>
                                        <strong>Location:</strong> {data.location}
                                    </Typography>
                                    <Typography sx={{mb: 1}}>
                                        <strong>Deadline:</strong> {data.deadline}
                                    </Typography>
                                    <Typography sx={{mb: 1}}>
                                        <strong>Budget Range:</strong> {data.budget_min} - {data.budget_max} BAM
                                    </Typography>
                                    <Typography sx={{mb: 1}}>
                                        <strong>Category:</strong> {data.procurementCategory.name}
                                    </Typography>

                                    <Box sx={{mt: 3}}>
                                        <Typography variant="h5" fontWeight={"bolder"}>Items</Typography>
                                        {data.items.map((item, index) => (
                                            <Box key={index} sx={{
                                                mb: 2,
                                                p: 2,
                                                border: '1px solid #ccc',
                                                borderRadius: 2,
                                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                            }}>
                                                <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 'bold'}}>
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{mb: 1}}>
                                                    {item.description}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Quantity: </strong> {item.quantity}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Box sx={{mt: 3}}>
                                        <Typography variant="h5" fontWeight={"bolder"}>Requirements</Typography>
                                        {data.requirements.map((req, index) => (
                                            <Box key={index} sx={{
                                                mb: 2,
                                                p: 2,
                                                border: '1px solid #ccc',
                                                borderRadius: 2,
                                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                            }}>
                                                <Typography variant="subtitle1" sx={{mb: 1}}>
                                                    Requirement type: <strong>{req.type}</strong>
                                                </Typography>
                                                <Typography variant="body2" sx={{mb: 1}}>
                                                    {req.description}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Container>
                    {/* List of bids related to the request*/}
                    <Container maxWidth="sm"></Container>
                    <SecondaryButton onClick={handleClose}>
                        Close Preview
                    </SecondaryButton>
                </Container>
            </Layout>
        );
    }
};

export default AdminProcurementPreview;