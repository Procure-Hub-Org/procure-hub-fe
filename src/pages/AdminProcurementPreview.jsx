import React, { use, useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import {Box, Card, CardContent, Chip, Container, Typography, Button} from "@mui/material";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";
import {isAuthenticated, isAdmin} from "../utils/auth.jsx";
import axios from "axios";
import {useTheme} from "@mui/material/styles";
import PrimaryButton from "../components/Button/PrimaryButton.jsx";


const AdminProcurementPreview = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [data, setData] = useState(null);
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;  // Number of bids per page
    const [view, setView] = useState('bids'); // 'bids' or 'logs'

    // Mock data for bids and logs
    const mockBids = [
        { seller: "Seller 1", price: "1000 BAM", timeline: "30 days", proposalText: "Proposal for procurement request 1", submittedAt: "2025-04-10 12:30" },
        { seller: "Seller 2", price: "1200 BAM", timeline: "25 days", proposalText: "Proposal for procurement request 2", submittedAt: "2025-04-12 14:15" },
        { seller: "Seller 3", price: "950 BAM", timeline: "35 days", proposalText: "Proposal for procurement request 3", submittedAt: "2025-04-14 10:00" },
        { seller: "Seller 4", price: "1100 BAM", timeline: "28 days", proposalText: "Proposal for procurement request 4", submittedAt: "2025-04-15 08:00" },
        { seller: "Seller 5", price: "1050 BAM", timeline: "32 days", proposalText: "Proposal for procurement request 5", submittedAt: "2025-04-17 13:00" },
        { seller: "Seller 6", price: "980 BAM", timeline: "40 days", proposalText: "Proposal for procurement request 6", submittedAt: "2025-04-20 09:30" }
    ];
    const mockLogs = [
        { action: "Created", time: "2025-04-10 12:30", user: "Admin" },
        { action: "Edited", time: "2025-04-12 14:15", user: "Admin" },
        { action: "Created", time: "2025-04-10 12:30", user: "Seller1" },
        { action: "Edited", time: "2025-04-12 14:15", user: "Seller2" }
    ];

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
        navigate('/admin-procurement-requests');
    };

    const indexOfLastBid = currentPage * itemsPerPage;
    const indexOfFirstBid = indexOfLastBid - itemsPerPage;
    const currentBids = mockBids.slice(indexOfFirstBid, indexOfLastBid);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(mockBids.length / itemsPerPage)) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const toggleView = (newView) => {
        setView(newView);
    };

    if (!data) {
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
                            <Chip
                                label={data.status.toUpperCase()}
                                color={data.status === "draft" ? "warning" : "success"}
                                sx={{ mb: 1 }}
                            />
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
                                <Typography variant="h3" gutterBottom>{data.title}</Typography>
                                <Typography variant="body1" gutterBottom><strong>Description:</strong> {data.description}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Location:</strong> {data.location}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Deadline:</strong> {data.deadline}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Budget Range:</strong> {data.budget_min} - {data.budget_max} BAM</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Category:</strong> {data.procurementCategory.name}</Typography>

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
                            </CardContent>
                        </Card>
                    </Box>

                    <Container maxWidth="md">
                        <Card sx={{ mt: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <PrimaryButton onClick={() => toggleView('bids')} sx={{ marginRight: 2, textTransform: 'none' }} variant={view === 'bids' ? 'contained' : 'outlined'}>Bids</PrimaryButton>
                                    <PrimaryButton onClick={() => toggleView('logs')} variant={view === 'logs' ? 'contained' : 'outlined'}>Logs</PrimaryButton>
                                </Box>

                                {view === 'bids' && (
                                    <>
                                        {currentBids.map((bid, index) => (
                                            <Box key={index} sx={{
                                                mb: 2,
                                                p: 2,
                                                border: '1px solid #ccc',
                                                borderRadius: 2,
                                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                            }}>
                                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Seller: {bid.seller}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Price:</strong> {bid.price}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Timeline:</strong> {bid.timeline}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Proposal:</strong> {bid.proposalText}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Submitted At:</strong> {bid.submittedAt}</Typography>
                                            </Box>
                                        ))}

                                        {/* Pagination Controls */}
                                        {view === 'bids' && (
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <PrimaryButton onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ marginRight: 2, textTransform: 'none'}}>Previous</PrimaryButton>
                                                <PrimaryButton onClick={handleNextPage} disabled={currentPage === Math.ceil(mockBids.length / itemsPerPage)}>Next</PrimaryButton>
                                            </Box>
                                        )}
                                    </>
                                )}

                                {view === 'logs' && (
                                    <Box>
                                        {mockLogs.map((log, index) => (
                                            <Box key={index} sx={{
                                                mb: 1, p: 1, border: '1px solid #ccc',
                                            }}>
                                                <Typography variant="body2"><strong>Action:</strong> {log.action}</Typography>
                                                <Typography variant="body2"><strong>Time:</strong> {log.time}</Typography>
                                                <Typography variant="body2"><strong>User:</strong> {log.user}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Container>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <SecondaryButton onClick={handleClose}>
                            Close Preview
                        </SecondaryButton>
                    </Box>
                </Container>
            </Layout>
        );
    }
};

export default AdminProcurementPreview;