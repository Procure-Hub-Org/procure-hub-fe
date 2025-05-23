import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import { Box, Card, CardContent, Chip, Container, Typography } from "@mui/material";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";
import { isAuthenticated, isAdmin } from "../utils/auth.jsx";
import axios from "axios";
import PrimaryButton from "../components/Button/PrimaryButton.jsx";

const AdminProcurementPreview = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bids, setBids] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    let x = 2*(currentPage - 1) + 1;

    useEffect(() => {
        if (!isAdmin()) {
            if (!isAuthenticated()) {
                window.location.href = "/login";
            } else {
                window.location.href = "/";
            }
            return;
        }

        setLoading(true);

        const fetchData = async () => {
            try {
                // Fetch procurement request data
                const requestRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/procurement-request/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(requestRes.data);
                console.log("Fetched request data:", requestRes.data);

                // Fetch bids
                const bidsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/procurement-bids/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBids(bidsRes.data);
                console.log("Fetched all bid data for request:", bidsRes.data);

                // Fetch alerts
                const alertsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/alerts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlerts(alertsRes.data);
                console.log("Fetched alerts:", alertsRes.data);

            } catch (error) {
                console.error("Error during data fetch:", error);
                setBids({ notFound: true });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleClose = () => {
        console.log('Close preview');
        navigate('/admin-procurement-requests');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min =String(date.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} at ${hh}:${min}`;
    };

    const indexOfLastBid = currentPage * itemsPerPage;
    const indexOfFirstBid = indexOfLastBid - itemsPerPage;
    const currentBids = bids.slice(indexOfFirstBid, indexOfLastBid);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(bids.length / itemsPerPage)) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    if (loading || !data) {
        return (
            <Layout>
                <Container maxWidth="md">
                    <Typography variant="h6" sx={{ mt: 4 }}>Loading procurement request...</Typography>
                </Container>
            </Layout>
        );
    } else {
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
                                color={
                                    {
                                        draft: 'warning',    
                                        active: 'success',   
                                        frozen: 'error',     
                                        closed: 'info',      
                                        awarded: 'success',  
                                    }[data.status] || 'default'
                                }
                                sx={{ mb: 1 }}
                            />
                            
                            {data.status === "awarded" && (
                                <Box>
                                    <Typography variant="body1" color="primary" textAlign={"center"}>
                                        <strong>Seller: </strong> {data.seller.fullName || "Jane Doe"}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Card>
                            <CardContent>
                                <Typography variant="h3" gutterBottom>{data.title}</Typography>
                                <Typography variant="body1" gutterBottom><strong>Description:</strong> {data.description}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Location:</strong> {data.location}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Deadline:</strong> {data.deadline? `${formatDate(data.deadline)}` : "No deadline"}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Budget Range:</strong> {data.budget_min} - {data.budget_max} $</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Category:</strong> {data.procurementCategory.name}</Typography>
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Enable bid proposals editing: </strong> {data.bid_edit_deadline? `Yes, until ${formatDate(data.bid_edit_deadline)}` : "No"}
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
                                            <Typography variant="body2" sx={{ mb: 1 }}>{item.description}</Typography>
                                            <Typography variant="body2"><strong>Quantity: </strong> {item.quantity}</Typography>
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
                                            <Typography variant="body2" sx={{ mb: 1 }}>{req.description}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                                {/* Ovo je dio koji se odnosi na kriteriji, radi kada ima controller na be */}
                                {data.evaluationCriteria.length > 0 && (
                                <Box sx={{ mt: 3}}>
                                    <Typography variant="h5" fontWeight={"bolder"}>Criteria</Typography>
                                    {data.evaluationCriteria.map((crit, index) => (
                                        <Box key={index} sx={{
                                            mb: 2,
                                            p: 2,
                                            border: '1px solid #ccc',
                                            borderRadius: 2,
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                        }}>
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                {crit.criteriaType.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                Weight: <strong> {crit.weight}% </strong>
                                            </Typography>
                                            <Typography variant="body2">
                                                Is must have: <strong> {crit.is_must_have ? "Yes" : "No"}  </strong>
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>)}
                                {alerts.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h5" fontWeight={"bolder"}>Alerts</Typography>
                                        {alerts.map((alert, idx) => (
                                            <Box key={idx} sx={{
                                                mb: 2,
                                                p: 2,
                                                border: '1px solid #f44336',
                                                borderRadius: 2,
                                                boxShadow: '0 1px 3px rgba(244, 67, 54, 0.2)',
                                                backgroundColor: '#ffebee',
                                            }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold'}}>
                                                    {alert.alert}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Created: {formatDate(alert.created_at)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                    <Container maxWidth="md">
                        <Card sx={{ mt: 3, p: 2 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                                Bids
                            </Typography>
                            {currentBids.map((bid, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        mb: 3,
                                        p: 2,
                                        border: '1px solid #ccc',
                                        borderRadius: 2,
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onClick={() => navigate(`/admin-procurement-requests/${id}/bid/${index + x}`)} // Kad se klikne na red
                                >
                                    <Box sx={{ position: 'relative', mb: 2 }}>
                                        <Chip
                                            label={`Score: ${bid.score !== null ? bid.score : 'N/A'}`}
                                            color="primary"
                                            size="medium"
                                            sx={{ position: 'absolute', top: 0, right: 0 }}
                                        />
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Seller: {bid.seller}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>Price:</strong> {bid.price} $
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>Timeline:</strong> {bid.timeline}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>Proposal:</strong> {bid.proposal}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Submitted At:</strong> {bid.submitted_at? `${formatDate(bid.submitted_at)}` : "Unknown"}
                                    </Typography>
                                </Box>
                            ))}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <PrimaryButton
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    sx={{ mr: 2, textTransform: 'none' }}
                                >
                                    Previous
                                </PrimaryButton>
                                <PrimaryButton
                                    onClick={handleNextPage}
                                    disabled={currentPage === Math.ceil(bids.length / itemsPerPage)}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Next
                                </PrimaryButton>
                            </Box>
                        </Card>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
                            <SecondaryButton onClick={handleClose}>Close Preview</SecondaryButton>
                        </Box>
                    </Container>
                </Container>
            </Layout>
        );
    }
};

export default AdminProcurementPreview;
